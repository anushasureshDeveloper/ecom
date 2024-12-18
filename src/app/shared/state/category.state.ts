import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { tap } from "rxjs";
import { GetCategories, CreateCategory, EditCategory, 
         UpdateCategory, DeleteCategory } from "../action/category.action";
import { Category, CategoryModel } from "../interface/category.interface";
import { CategoryService } from "../services/category.service";
import { NotificationService } from "../services/notification.service";


export class CategoryStateModel {
  category = {
    data: [] as Category[],
    total: 0
  }
  selectedCategory: Category | null;
}

@State<CategoryStateModel>({
  name: "category",
  defaults: {
    category: {
      data: [],
      total: 0
    },
    selectedCategory: null
  },
})
@Injectable()
export class CategoryState {
  
  constructor(private store: Store, private router: Router,
    private notificationService: NotificationService,
    private categoryService: CategoryService) {}

  @Selector()
  static category(state: CategoryStateModel) {
    return state.category;
  }

  @Selector()
  static categories(state: CategoryStateModel) {
    return state.category.data.map(res => { 
      return { label: res?.name, value: res?.id, data: { 
        name: res.name,
        slug: res.slug,
        image: res.category_icon ? res.category_icon.original_url : 'assets/images/category.png' 
      }}
    });
  }


  @Selector()
  static selectedCategory(state: CategoryStateModel) {
    return state.selectedCategory;
  }

  @Action(GetCategories)
  getCategories(ctx: StateContext<CategoryStateModel>, action: GetCategories) {
    return this.categoryService.getCategories(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            category: {
              data: result.data,
              total: result?.total ? result?.total : result.data.length
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateCategory)
  create(ctx: StateContext<CategoryStateModel>, {payload}: CreateCategory) {
   // Category Create Logic Here
   return this.categoryService.postCategories(payload).pipe(
    tap((res:CategoryModel)=>{
    //  console.log(res,"category");
 ctx.patchState({
  category:{
    data: res.data,
    total: 0
  }

 })
    }
  
  ))
}
 @Action(EditCategory)
  edit(ctx: StateContext<CategoryStateModel>, { id }: EditCategory) {
    const state = ctx.getState();
    const result = state.category.data.find(category => category.id == id);
    ctx.patchState({
      ...state,
      selectedCategory: result
    });
  }

  @Action(UpdateCategory)
  update(ctx: StateContext<CategoryStateModel>, { payload, id }: UpdateCategory) {
    // Category Update Logic Here
    const state=ctx.getState()
    const result=state.category.data.find(category=>category.id == id)
    ctx.patchState
    ({
...state,
selectedCategory:result
    })
  }

  @Action(DeleteCategory)
  delete(ctx: StateContext<CategoryStateModel>, { id, type }: DeleteCategory) {
    // Category Delete Logic Here
    const state= ctx.getState()
    const result= state.category.data.find(category=>category.id== id)
    ctx.patchState({
      ...state,
      selectedCategory:result
    })
  }

}
