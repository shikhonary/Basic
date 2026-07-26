import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@workspace/auth/server"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter: FileRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers })

      if (!session || !session.user) {
        throw new UploadThingError("You must be logged in to upload a profile picture.")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = file.ufsUrl || file.url
      console.log(`[UploadThing] Profile picture upload complete for user ${metadata.userId}: ${fileUrl}`)

      return {
        uploadedBy: metadata.userId,
        url: fileUrl,
      }
    }),
}

export type OurFileRouter = typeof ourFileRouter
