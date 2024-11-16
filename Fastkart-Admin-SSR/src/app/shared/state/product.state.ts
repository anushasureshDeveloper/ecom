import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetProducts, CreateProduct, EditProduct, 
         UpdateProduct, UpdateProductStatus, ApproveProductStatus, DeleteProduct, 
         DeleteAllProduct, ReplicateProduct } from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { NotificationService } from "../services/notification.service";
import { log } from "console";

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
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    // Call the service to get products
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          const { data, total } = result;
         
          console.log(result);
          
  
          if (action.payload?.["top_selling"]) {
            // If "top_selling" flag is present, update top-selling products only
            if (data && data.length) {
              ctx.patchState({
                topSellingProducts: data.slice(0, 7), // Get the top 7 selling products
              });
            }
          } else {
            if (data && data.length) {
              // Update the full product list and total
              ctx.patchState({
                product: {
                  data: data, // Update the product list with the fetched data
                  total: total || data.length, // Set the total number of products
                },
              });
            } else {
              console.warn('No products found in the response.');
              this.notificationService.showError('No products found.');
            }
          }
        },
        error: (err) => {
          // Handle error, show notification
          const errorMessage = err?.error?.message || "An error occurred while fetching products";
          this.notificationService.showError(`Failed to fetch products: ${errorMessage}`);
          console.error("Error fetching products:", err);
        },
      })
    );
  }
  
  

  // @Action(CreateProduct)
  // create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
  //   // Product Create Logic Here
  // }


  


@Action(CreateProduct)
create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
  const state = ctx.getState();

  return this.productService.createProduct(action.payload).pipe(
    tap({
      next: (createdProduct: Product) => {
        // Add the newly created product to the state
        ctx.patchState({
          product: {
            data: [...(state.product?.data || []), createdProduct], // Append the new product
            total: (state.product?.total || 0) + 1, // Increment total count
          },
        });

        // Show success notification
        this.notificationService.showSuccess('Product created successfully!');
      },
      error: (err) => {
        const errorMessage = err?.error?.message || "An error occurred while creating the product.";
        this.notificationService.showError(`Failed to create product: ${errorMessage}`);
        console.error("Error creating product:", err);
      },
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
  update(ctx: StateContext<ProductStateModel>, { payload, id }: UpdateProduct) {
   
    // Product Update Logic Here
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
