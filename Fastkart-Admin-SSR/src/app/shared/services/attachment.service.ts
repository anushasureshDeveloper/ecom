import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Attachment, AttachmentModel } from "../interface/attachment.interface";

@Injectable({
  providedIn: "root",
})
export class AttachmentService {

  constructor(private http: HttpClient) { }
  configUrl = "http://localhost:2000/"

  // getAttachments(payload?: Params): Observable<AttachmentModel> {
  //   return this.http.get<AttachmentModel>(`${environment.URL}/media.json`, { params: payload });
  // }

  getAttachments(payload?: Params): Observable<AttachmentModel> {
    
    const params = payload ? new HttpParams({ fromObject: payload }) : new HttpParams();
  
    return this.http.get<AttachmentModel>(`${this.configUrl}getImages`, { params });
  }

  // uploadFiles(files: File[]): Observable<Attachment[]> {
  //   const formData = new FormData();
  //   console.log(files); // Check the file array to make sure files are passed
  
  //   // Append each file to the FormData object
  //   files.forEach((file) => {
  //     formData.append('files', file, file.name); // Ensure this matches your backend API expectation
  //   });
  
  //   // Ensure configUrl has the correct base URL and endpoint
  //   const uploadUrl = `${this.configUrl}createImages`;
  
  //   // Send the formData (not the files array) in the POST request
  //   return this.http.post<Attachment[]>(uploadUrl, formData);
  // }
  



  uploadFiles(files: File[]): Observable<Attachment[]> {
    const formData = new FormData();
  
    console.log('Files to upload:', files);
  
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    const uploadUrl = `${this.configUrl}createImages`;
  
    return this.http.post<{ message: string, files: Attachment[] }>(uploadUrl, formData).pipe(
      map(response => {
        console.log('Server Response:', response);
       
        if (response && response.files && Array.isArray(response.files)) {
          return response.files;
        }
        
        // Handle the case where the response doesn't match expected structure
        throw new Error('Unexpected response structure');
      }),
      catchError((error) => {
        console.error('Error uploading files:', error);
        // Handle error appropriately and return an empty array or a custom error message
        return throwError(() => new Error('Failed to upload files')); // Use `throwError` correctly
      })
    );
  }
}  