import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

export const UploadButton: any = generateUploadButton<OurFileRouter>()
export const UploadDropzone: any = generateUploadDropzone<OurFileRouter>()

const helpers = generateReactHelpers<OurFileRouter>()

export const useUploadThing: any = helpers.useUploadThing
export const uploadFiles: any = helpers.uploadFiles
