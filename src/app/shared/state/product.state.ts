import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import {  catchError, tap } from "rxjs/operators";
import { GetProducts, CreateProduct, EditProduct, 
         UpdateProduct, UpdateProductStatus, ApproveProductStatus, DeleteProduct, 
         DeleteAllProduct, ReplicateProduct } from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { error } from "node:console";


export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  topSellingProducts: Product[]
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    topSellingProducts: []
  },
})
@Injectable()
export class ProductState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private router:Router,
    private productService: ProductService) {}

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static products(state: ProductStateModel) {
    return state.product.data.filter(data => data.id !== state.selectedProduct?.id).map((res: Product) => { 
      return { label: res?.name, value: res?.id, data: { 
        type: res.type,
        name: res.name,
        slug: res.slug,
        stock_status: res.stock_status,
        image: res.product_thumbnail ? res.product_thumbnail.original_url : 'assets/images/product.png' 
      }}
    })
  }
 
  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static topSellingProducts(state: ProductStateModel) {
    return state.topSellingProducts;
  }

  // @Action(GetProducts)
  // getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
  //   return this.productService.getProducts(action.payload).pipe(
  //     tap({
  //       next: (result: ProductModel) => { 
  //         if(action?.payload!['top_selling']) {
  //           const state = ctx.getState();
  //           ctx.patchState({            
  //             ...state,
  //             topSellingProducts: result?.data?.slice(0,7)
  //           });
  //         } else {
  //           ctx.patchState({
  //             product: {
  //               data: result?.data,
  //               total: result?.total ? result?.total : result.data?.length
  //             }
  //           });
  //         }
  //       },
  //       error: err => { 
  //         throw new Error(err?.error?.message);
  //       }
  //     })
  //   );
  // }
 @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, {payload}: GetProducts) {
    return this.productService.getProducts(payload).pipe(
      tap((result: ProductModel) => {
        console.log(result);
       // if (result && result.data && typeof result.total === 'number'){
        ctx.patchState({
          product: {
            data: result.data,
            total: result.total
            
          },
        });
        
    // }
      }),
      catchError((error) => {
        this.notificationService.showError('Failed to fetch products');
        return of(error);
      })
    );
  }



  // @Action(CreateProduct)
  //create(ctx: StateContext<ProductStateModel>, action: Product) {
  //  this.productService.create(action.data).subscribe(
  //   (res:any)=>{
  //     const {product}=res;
  //     ctx.patchState({product})
  //     this.notificationService.showSuccess('success');
  //     this.router.navigate(['/'])
  //   },
      
      
   
  //    (error:any)=>{
  //     this.notificationService.showError("Error")
  //     this.router.navigate(['/'])

  //    }
  //  )
  // }

 @Action(CreateProduct)
  create(ctx: StateContext<ProductStateModel>, { payload }: CreateProduct) {
    return this.productService.create(payload).pipe(
      tap((res:ProductModel) => {
        // ctx.getState();
         console.log(res,"result");
        ctx.patchState({
          product: {
            data: res.data || [],
            total: res.total || 0
          }
        });
        console.log(payload,"payload");
        this.notificationService.showSuccess('Product created successfully!');
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        this.notificationService.showError("Failed to create product");
        return of(error);
      })
    );
  }

  @Action(EditProduct)
  edit(ctx: StateContext<ProductStateModel>, { id }: EditProduct) {
    const state = ctx.getState();
    const result = state.product.data.find(product => product.id == id);
    ctx.patchState({
      ...state,
      selectedProduct: result
    });
  }

  @Action(UpdateProduct)
  update(ctx: StateContext<ProductStateModel>, { payload,id }: UpdateProduct) {
    // Product Update Logic Here
  //   return this.productService.update(payload).pipe(
  //     tap((res: any) => {
  //       const updatedProduct = res.product;
  //       const state = ctx.getState();

  //       // Find the index of the product to update
  //       const updatedData = state.product.data.map((product) => 
  //         product.id === updatedProduct.id ? updatedProduct : product
  //       );

  //       ctx.patchState({
  //         product: {
  //           data: updatedData,
  //           total: state.product.total  // Keep the total as is (assuming it doesn't change)
  //         }
  //       });

  //       this.notificationService.showSuccess('Product updated successfully!');
  //       this.router.navigate(['/']);
  //     }),
  //     catchError((error) => {
  //       this.notificationService.showError('Failed to update product');
  //       return of(error);
  //     })
  //   );
  // }
  }

  @Action(UpdateProductStatus)
  updateStatus(ctx: StateContext<ProductStateModel>, { id, status }: UpdateProductStatus) {
    // Product Update Status Logic Here
  }

  @Action(ApproveProductStatus)
  approveStatus(ctx: StateContext<ProductStateModel>, { id, status }: ApproveProductStatus) {
    // Product Approve Status Logic Here
  }

  @Action(DeleteProduct)
  delete(ctx: StateContext<ProductStateModel>, { id }: DeleteProduct) {
    // Product Delete Logic Here
  }

  @Action(DeleteAllProduct)
  deleteAll(ctx: StateContext<ProductStateModel>, { ids }: DeleteAllProduct) {
    // Product Delete All Logic Here
  }

  @Action(ReplicateProduct)
  replicateProduct(ctx: StateContext<ProductStateModel>, { ids }: ReplicateProduct) {
    // Product Replicate Logic Here
  }

}
