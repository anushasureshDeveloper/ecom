import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { tap } from "rxjs";
import { GetCategories, CreateCategory, EditCategory, 
         UpdateCategory, DeleteCategory } from "../action/category.action";
import { Category } from "../interface/category.interface";
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

  // @Action(GetCategories)
  // getCategories(ctx: StateContext<CategoryStateModel>, action: GetCategories) {
  //   return this.categoryService.getCategories(action.payload).pipe(
  //     tap({
  //       next: result => { 
  //         ctx.patchState({
  //           category: {
  //             data: result.data,
  //             total: result?.total ? result?.total : result.data.length
  //           }
  //         });
  //       },
  //       error: err => { 
  //         throw new Error(err?.error?.message);
  //       }
  //     })
  //   );
  // }



  @Action(GetCategories)
  getCategories(ctx: StateContext<CategoryStateModel>, action: GetCategories) {
    // Getting the current state of the categories
    const state = ctx.getState();
  
    // Calling the service to fetch categories with any optional parameters passed in action.payload
    return this.categoryService.getCategories(action.payload).pipe(
      tap({
        next: (result) => {
          console.log(result.data.length);
  
          // Updating the state with the retrieved categories
          ctx.patchState({
            category: {
              data: result.data, // New categories data from the response
              total: result.total || result.data.length, // Total number of categories (if provided)
            },
          });
  
          // Optionally, show a success notification
          this.notificationService.showSuccess('Categories loaded successfully.');
        },
        error: (err) => {
          // Handling any errors that occurred while fetching categories
          this.notificationService.showError('Failed to load categories.');
          throw new Error(err?.error?.message);
        },
      })
    );
  }
  


  // @Action(CreateCategory)
  // create(ctx: StateContext<CategoryStateModel>, action: CreateCategory) {
  //   // Category Create Logic Here
  // }



  @Action(CreateCategory)
create(ctx: StateContext<CategoryStateModel>, action: CreateCategory) {
  const state = ctx.getState();
  
  // Call the category service to create the category
  return this.categoryService.createCategory(action.payload).pipe(
    tap({
      next: (result) => {
        // Update the state after the category has been created
        ctx.patchState({
          category: {
            ...state.category,
            data: [...state.category.data, result]  // Append new category to the list
          },
        });

        // Optionally, show a success notification
        this.notificationService.showSuccess('Category created successfully.');

        // Redirect or handle any other logic (e.g., navigating to category list)
        this.router.navigateByUrl('/category');
      },
      error: (err) => {
        // Handle any errors, e.g., show an error notification
        this.notificationService.showError('Failed to create category.');
        throw new Error(err?.error?.message);
      }
    })
  );
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
  }

  @Action(DeleteCategory)
  delete(ctx: StateContext<CategoryStateModel>, { id, type }: DeleteCategory) {
    // Category Delete Logic Here
  }

}
