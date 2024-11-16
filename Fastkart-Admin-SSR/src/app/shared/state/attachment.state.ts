import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetAttachments, CreateAttachment, DeleteAttachment, DeleteAllAttachment } from "../action/attachment.action";
import { AttachmentModel } from "../interface/attachment.interface";
import { AttachmentService } from "../services/attachment.service";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";

export class AttachmentStateModel {
  attachment: AttachmentModel
}

@State<AttachmentStateModel>({
  name: "attachment",
  defaults: {
    attachment: {
      data: [],
      total: 0,
      length: 0
    }
  },
})
@Injectable()
export class AttachmentState {

  
  constructor(private store: Store, 
    private router:Router,
    private notificationService: NotificationService,
    private attachmentService: AttachmentService) {}

  @Selector()
  static attachment(state: AttachmentStateModel) {
    return state.attachment;
  }

  @Action(GetAttachments)
getAttachments(ctx: StateContext<AttachmentStateModel>, action: GetAttachments) {
  return this.attachmentService.getAttachments(action.payload).pipe(
    tap({
      next: result => { 
        // On success, update the state with the result
        ctx.patchState({
          attachment: result
        });
      },
      error: err => { 
        // Handle error more gracefully, perhaps using a notification service
        const errorMessage = err?.error?.message || 'Failed to fetch attachments';
        this.notificationService.error(errorMessage);  // Assuming you have a notification service
        console.error('Error fetching attachments:', errorMessage);
        throw new Error(errorMessage);  // Rethrow or handle the error as needed
      }
    })
  );
}


  // @Action(CreateAttachment)
  // create(ctx: StateContext<AttachmentStateModel>, action: CreateAttachment) {
  //   // Upload File Logic Here
  // }



  @Action(CreateAttachment)
create(ctx: StateContext<AttachmentStateModel>, action: CreateAttachment) {
  return this.attachmentService.uploadFiles(action.payload).pipe(
    tap({
      next: (newAttachments) => {
        const state = ctx.getState();

        // Ensure newAttachments is an array and contains valid data
        if (Array.isArray(newAttachments) && newAttachments.length > 0) {
          // Update the state with the new attachments
          ctx.patchState({
            attachment: {
              ...state.attachment,
              data: [...state.attachment.data, ...newAttachments], // Add new attachments to the existing list
              total: state.attachment.total + newAttachments.length // Update the total count of attachments
            }
          });

          // Notify the user about the successful upload
          this.notificationService.success("Files uploaded successfully");

          // Trigger navigation to the dashboard (assuming you have a router service injected)
          this.router.navigate(['/media']); // Adjust the path according to your routes
        } else {
          // Handle the case where no valid attachments were returned
          this.notificationService.error("No valid attachments received.");
        }
      },
      error: (err) => {
        // Handle the error during upload
        this.notificationService.error("Failed to upload files");
        console.error("Upload error:", err);
      }
    })
  );
}



  @Action(DeleteAttachment)
  delete(ctx: StateContext<AttachmentStateModel>, { id }: DeleteAttachment) {
    // Delete File Logic Here
  }

  @Action(DeleteAllAttachment)
  deleteAll(ctx: StateContext<AttachmentStateModel>, { ids }: DeleteAllAttachment) {
    // Delete Multiple File Logic Here
  }

}
