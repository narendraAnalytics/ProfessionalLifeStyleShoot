---
title: React ImageKit SDK
description: Real-time image & video resizing, automatic optimization, responsive images, and file uploading in React using ImageKit.io.
---

The React ImageKit SDK is a React-specific wrapper built on top of the ImageKit JavaScript SDK. It seamlessly integrates ImageKit’s URL generation, image and video optimization, responsive image handling, and file upload capabilities into React applications.

The SDK is lightweight and has first-class TypeScript support. You can view the [source code](https://github.com/imagekit-developer/imagekit-react) on Github.

## Installation and Setup

Install the React SDK via npm or yarn:

```bash
npm install @imagekit/react
# or
yarn add @imagekit/react
```

The SDK supports both server-side rendering (SSR) and client-side rendering (CSR), so it can be added to any React project—Create React App, Next.js, or any other framework. However, if you are building Next.js app, use our [Next.js SDK](/integration/nextjs).

This React SDK exports `Image` and `Video` components. These components automatically handle the URL generation logic for images and videos, respectively. They also support lazy loading, responsive images, and transformations.

```jsx
import { Image } from '@imagekit/react';

export default function Page() {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
  )
}
```

You can wrap `Image` and `Video` components inside the `ImageKitProvider` to set default values for `urlEndpoint` and `transformationPosition`. This allows you to avoid repeating these values in every component, making your code cleaner and more maintainable.

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function Page() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/profile.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </ImageKitProvider>
  )
}
```

Besides `Image` and `Video`, the SDK also provides utility functions and error classes that can be used independently of the components.

#### Utility functions
- [`buildSrc`](/integration/javascript#buildsrc-parameters) – Generates URLs for images and videos based on your URL endpoint and transformation parameters.
- [`buildTransformationString`](/integration/javascript#buildtransformationstring-parameters) – Converts array of transformation objects into a URL query string.
- [`upload`](/integration/javascript#upload-parameters) – Facilitates file uploads to ImageKit with built-in support for common error handling, progress tracking, and abort functionality.
- [`getResponsiveImageAttributes`](/integration/javascript#getresponsiveimageattributes-parameters) – Generates responsive image attributes that can be used on raw HTML image elements. This SDK however handles this automatically for you when using the `Image` component.

Refer to linked documentation for detailed usage of these utility functions.

#### Error classes for upload error handling
- `ImageKitInvalidRequestError` - For invalid requests.
- `ImageKitAbortError` - For aborted uploads.
- `ImageKitUploadNetworkError` - For network errors during upload.
- `ImageKitServerError` - For server-side errors.

#### React Specific Components
- [`Image`](#image-component) – It is a wrapper around the HTML `img` tag, extending its functionality to support ImageKit-specific features.
- [`Video`](#video-component) – A lightweight wrapper for the HTML video element that automatically generates URLs for video assets with ImageKit transformations.
- `ImageKitProvider` & `ImageKitContext` – Components that let you configure default settings (such as `urlEndpoint` and `transformationPosition`) for all nested Image and Video components.

#### Type definitions
The SDK provides TypeScript definitions for all components and utility functions, ensuring type safety and autocompletion in your IDE. Exported types include `ImageKitProviderProps`, `IKImageProps`, `IKVideoProps`, `SrcOptions`, `UploadOptions`, `UploadResponse`, `Transformation`, `GetImageAttributesOptions`, and `ResponsiveImageAttributes`.

## Image Component

The `Image` component is a wrapper around the HTML `img` element. It allows you to use ImageKit’s URL generation and transformation, lazy-loading, responsive images etc.
 
It supports all [HTML img attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#attributes) and additionally accepts the following ImageKit-specific props:

{% table %}

- Parameter {% width="30%" %}
- Description and Example {% width="70%" %}

---

- **urlEndpoint**  
- The base URL endpoint from your [ImageKit dashboard](https://imagekit.io/dashboard/url-endpoints).
  To avoid passing this prop in every component, you can wrap your components in an `ImageKitProvider` and set the `urlEndpoint` there. In case you pass it in the component, it will override the value set in the provider.
  
  Example: `https://ik.imagekit.io/your_imagekit_id`.

---

- **src**  
  (Required)  
- A relative or absolute path to the image.

  - If a **relative path** is provided, it is appended to the `urlEndpoint`.
  - If an **absolute path** is provided, it is used as-is and the `urlEndpoint` is ignored.
  - **Do not include query parameters** directly in the `src`. Use the `queryParameters` prop instead.
  - **When using a web proxy**, you can pass the full image URL and prepend it with a `/`. For example - `/https://example.com/image.jpg`.

  **Examples:**  
  Relative - `/default-image.jpg`  
  Absolute - `https://example.com/image.jpg`  
  Web Proxy - `/https://example.com/image.jpg`

---

- **width**
- The width of the image in pixels (in numbers). This is used to calculate the srcSet attribute and is only utilized when sizes is not provided. The prop is set on the `<img>` element as it is. If provided value is not a number, then `srcset` is generated using the full list of device breakpoints
  
  Example: `width="300"`

---

- **transformation**
- An array of transformation objects. Each object can include properties like `width`, `height`, `rotation`, overlays, and advanced effects.  
  
  Example: `[ { width: 300, height: 300 } ]`  
  
  See all [supported transformation](#supported-transformations) options and how to [handle unsupported transformations](#handling-unsupported-transformations).

---

- **queryParameters**
- An object with additional query parameters to append to the URL.  
  Example: `{ v: 2 }`

---

- **responsive**
- A boolean that determines if responsive image functionality is enabled. By default, this is `true`, meaning that a `srcset` attribute is automatically generated for responsive images. Set it to `false` to disable this behavior and only apply explicitly defined transformations.

---

- **deviceBreakpoints**  
  (number[])
- It allows you to specify a list of device width breakpoints.

  Defaults to `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`.

---

- **imageBreakpoints**  
  (number[])
- It allows you to specify a list of image width breakpoints. It is concatenated with `deviceBreakpoints` before calculating `srcSet`. 
  
  Defaults to `[16, 32, 48, 64, 96, 128, 256, 384]`.

---

- **transformationPosition**
- Specifies whether the transformation string is included in the URL path or as a query parameter. Defaults to `"query"`.  
  Example: `"query"` or `"path"`

{% /table %}

## Video Component

The `Video` component is a lightweight wrapper around the HTML `video` element. It allows you to use ImageKit’s URL generation and transformation capabilities. It supports all [HTML video attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attributes) and additionally accepts the following ImageKit-specific props - `urlEndpoint`, `transformation`, `transformationPosition`, and `queryParameters`. For the definition of these props, refer to the [Image component](#image-component) section.

```js
import { Video } from '@imagekit/react';
export default function Page() {
  return (
    <Video
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/video.mp4"
      controls
      width={500}
      height={500}
    />
  )
}
```

## Height and Width Transformations

With ImageKit, you can resize images on the fly using the `width` and `height` properties. The SDK automatically generates the appropriate URL with the specified dimensions.

```jsx
import { Image } from '@imagekit/react';

export default function Page() {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
      transformation={[{ width: 500, height: 500 }]}
    />
  )
}
```

## Responsive Images

The `Image` component includes built-in support for **responsive images**, enabled by default. It automatically generates appropriate `srcSet` attributes based on device and image breakpoints, ensuring optimal image delivery across screen sizes.

Under the hood, it leverages the [`getResponsiveImageAttributes`](/integration/javascript#getresponsiveimageattributes-parameters) utility from the core JavaScript SDK to generate these attributes.

If you want to turn off responsive images, you can set `responsive` to `false`. This will disable the automatic generation of `srcset` attributes.

{% callout style="info" %}
**Note:** If you have enabled the "Restrict unnamed transformations" setting (see [Basic Security](/media-delivery-basic-security#restrict-unnamed-transformations)), hardcoded width/crop transformations may be added by default causing request failures. Setting `responsive` to `false` prevents these additional transformations from being applied.
{% /callout %}

## Lazy Loading Images

The `Image` component supports lazy loading by default. You can control this behavior using the [`loading`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading) prop.

By default, `loading` is set to `lazy`, which defers loading the image until it is near the viewport.

If set to `eager`, the image loads immediately.

```jsx
import { Image } from '@imagekit/react';
export default function Page() {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
      loading="lazy" // Use "eager" to load immediately. `lazy` is the default value
    />
  )
}
```

## Lazy Loading with Placeholder

To display a placeholder while an image is loading, you can generate a placeholder image URL using ImageKit’s [`buildSrc`](/integration/javascript#buildsrc-parameters) utility function and apply it as a background image using the `style` prop. Once the actual image is mounted, you can hide the placeholder by checking the [`complete`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/complete) property of the image element.

{% callout style="info" %}
**Good to know**  
We avoid using the `onLoad` event to hide the placeholder because it may not always fire or attach reliably. For instance, if the image is cached or loads before the JavaScript bundle is fully loaded and executed, the `onLoad` event might be skipped entirely.
{% /callout %}

```jsx
import { Image, buildSrc } from "@imagekit/react";
import { useState, useRef, useCallback } from "react";
export default function Page() {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const hidePlaceholder = () => setShowPlaceholder(false);

  const imgRef = useCallback((img) => {
    if (!img) return; // unmount

    if (img.complete) {
      hidePlaceholder();
      return;
    }
  }, []);

  return (
    <Image
      src="/default-image.jpg"
      alt="React logo"
      width={400}
      height={400}
      loading="eager" // To ensure the image starts loading immediately
      ref={imgRef}
      style={showPlaceholder ? {
        backgroundImage: `url(${buildSrc({
          urlEndpoint: "https://ik.imagekit.io/ikmedia",
          src: "/default-image.jpg",
          transformation: [
            // {}, // Any other transformation you want to apply to the placeholder image
            {
              quality: 10,
              blur: 90,
            }
          ]
        })})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      } : {}}
    />
  )
}
```

## Lazy Loading Videos
To lazy load a video using `Video` component, you can set the `preload` attribute to `none` and specify a `poster` image by extracting a thumbnail from the video.

The [`buildSrc`](/integration/javascript#buildsrc-parameters) utility function is used to generate the thumbnail URL. It accepts the same parameters as the `Video`/`Image` component and returns a URL with the specified transformations.

Refer to the [create thumbnail](/create-video-thumbnails) documentation for detailed instructions on generating a thumbnail from a video using ImageKit.

```jsx
import { Video, buildSrc } from '@imagekit/react';
export default function Page() {
  return (
    <Video
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/video.mp4"
      controls
      preload="none"
      poster={buildSrc({
        urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
        src: `/video.mp4/ik-thumbnail.jpg`, // Append ik-thumbnail.jpg after the video URL
      })}
    />
  )
}
```

## Chained Transformations

You can chain multiple transformations together by passing an array of transformation objects. Each object can specify different properties, such as width, height, cropping, overlays, and effects. See [chained transformations](/transformations#chained-transformations) for more details.

```jsx
import { Image } from '@imagekit/react';
export default function Page() {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
      transformation={[
        { width: 400, height: 300 },
        { rotation: 90 }
      ]}
    />
  )
}
```

## Adding Overlays

You can add overlays to images and videos. The overlay can be a text, image, video, or subtitle.

Besides the overlay type, you can also specify the position, size, and other properties of the overlay. Check the [overlay options](#overlay-reference) for more details.

### Image Overlay

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function ImageOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with image overlay"
        width={600}
        height={400}
        transformation={[
          { overlay: { type: "image", input: "logo.png" } }
        ]}
      />
    </ImageKitProvider>
  );
}
```

You can independently transform the overlay image by passing a transformation array inside the `overlay` object. The transformation will be applied to the overlay image only.

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function ImageOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with image overlay"
        width={600}
        height={400}
        transformation={[
          { 
            overlay: { 
              type: "image",
              input: "logo.png",
              transformation: [{ width: 100, height: 100 }] // Transformations for the overlay image and not the background image
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

Image overlays support a wide range of transformations. Check [reference](/add-overlays-on-images#list-of-supported-image-transformations-in-image-layers) for the complete list of transformations supported on image overlays.

### Solid Color Overlay

You can add a solid color overlay to images and videos.

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function ColorOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with solid color overlay"
        width={600}
        height={400}
        transformation={[
          { 
            overlay: { 
              type: "solidColor",
              color: "FF0000" 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

You can also specify the width, height, and other properties of the solid color overlay. For example:

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';
export default function ColorOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with 100x100 solid color overlay"
        width={600}
        height={400}
        transformation={[
          { 
            overlay: { 
              type: "solidColor",
              color: "FF0000",
              transformation: [
                { width: 100, height: 100 }
              ]
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

For more options related to styling the solid color overlay, check the [solid color overlay transformations](#solid-color-overlay-transformations) section.

### Text Overlay

You can add text overlays to images and videos.

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';
export default function TextOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with text overlay"
        width={600}
        height={400}
        transformation={[
          { 
            overlay: { 
              type: "text", 
              text: "Hello, ImageKit!" 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

You can also specify the font size, color, and other properties of the text overlay. For example:

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function TextOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/background.jpg"
        alt="Background with text overlay"
        width={600}
        height={400}
        transformation={[
          { 
            overlay: { 
              type: "text", 
              text: "Hello, ImageKit!", 
              transformation: [
                { fontSize: 20, fontColor: "FF0000" } // Specify font size and color of the text
              ] 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

Check the [text overlay transformations](#text-overlay-transformations) section for more options related to styling the text.

### Video Overlay

You can add video overlays on videos only.

```jsx
import { Video, ImageKitProvider } from '@imagekit/react';

export default function VideoOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Video
        src="/background.mp4"
        controls
        transformation={[
          { 
            overlay: { 
              type: "video", 
              input: "overlay.mp4" 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

Additionally, you can specify the start and duration for the overlay video. For example:

```jsx
import { Video, ImageKitProvider } from '@imagekit/react';
export default function VideoOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Video
        src="/background.mp4"
        controls
        transformation={[
          { 
            overlay: { 
              type: "video", 
              input: "overlay.mp4",
              timing: { start: 5, duration: 10 } // Overlay appears at 5 seconds and lasts for 10 seconds
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

You can also independently transform the overlay video. For example, to resize the overlay video:

```jsx
import { Video, ImageKitProvider } from '@imagekit/react';
export default function VideoOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Video
        src="/background.mp4"
        controls
        transformation={[
          { 
            overlay: { 
              type: "video", 
              input: "overlay.mp4",
              transformation: [
                { width: 100, height: 100 } // Transformations for the overlay video and not the background video
              ] 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

All supported [video transformations](/video-transformation) can also be applied to overlay videos.

If you're overlaying an image on a base video, refer to [this list](/add-overlays-on-videos#list-of-transformations-supported-on-image-overlay) for all the transformations supported on image overlays.

### Subtitle Overlay

You can add subtitle overlays on videos.

```jsx
import { Video, ImageKitProvider } from '@imagekit/react';

export default function SubtitleOverlayExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Video
        src="/background.mp4"
        controls
        transformation={[
          { 
            overlay: { 
              type: "subtitle", 
              input: "subtitle.srt" 
            } 
          }
        ]}
      />
    </ImageKitProvider>
  );
}
```

The subtitle overlay can be styled with various properties such as font size, color, and outline. See the [Subtitle Overlay Transformations](#subtitle-overlay-transformations) section for all styling options.

## Background Removal Using AI

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function BackgroundRemovalExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/photo.jpg"
        alt="Photo with background removal"
        width={500}
        height={500}
        transformation={[
          { aiRemoveBackground: true }
        ]}
      />
    </ImageKitProvider>
  );
}
```

ImageKit supports multiple AI-powered transformations, like upscaling, generative fill, and more. More examples:

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';
export default function AIDropShadow() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/photo.jpg"
        alt="Photo with AI drop shadow"
        width={500}
        height={500}
        transformation={[
          { aiDropShadow: true }
        ]}
      />
    </ImageKitProvider>
  );
}
```

Upscaling example:

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';
export default function AIUpscaleExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/photo.jpg"
        alt="Photo with AI upscaling"
        width={500}
        height={500}
        transformation={[
          { aiUpscale: true }
        ]}
      />
    </ImageKitProvider>
  );
}
```

## Arithmetic Expressions

You can use arithmetic expressions to dynamically compute transformation values. For example, to set the width to half of the original image width:

```jsx
import { Image, ImageKitProvider } from '@imagekit/react';

export default function ArithmeticExample() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
      <Image
        src="/photo.jpg"
        alt="Photo with arithmetic width"
        width={300}
        height={200}
        transformation={[
          { width: "iw_div_2" }
        ]}
      />
    </ImageKitProvider>
  );
}
```

Check out the [Arithmetic Expressions](/arithmetic-expressions-in-transformations) reference for more examples and details.

## Uploading Files

The React SDK exports a utility function, `.upload`, which enables you to upload files to ImageKit. This `upload()` function leverages the [Upload V1 API](/api-reference/upload-file/upload-file), accepting an options object and returning a promise that resolves with the upload response.

The SDK automatically converts certain parameters into JSON strings, as required by the API. If a parameter is not explicitly supported by the SDK, it is included in the request as-is. For a complete list of parameters and expected formats, refer to the API documentation.

### upload() Parameters

The `upload()` function accepts a JSON object with the following parameters:

{% table %}

- Option {% width="30%" %}
- Description and Example {% width="70%" %}

---

- **file**  
  (Required)  
- The file content to be uploaded. Accepts binary data, a base64-encoded string, or a URL. Typically used with a File or Blob in the browser. Example: `file: fileInput.files[0]`

---

- **fileName**  
  (Required)  
- The name to assign to the uploaded file. Supports alphanumeric characters, dot, underscore, and dash. Any other character is replaced with `_`. Example: `fileName: "myImage.jpg"`

---

- **signature**  
  (Required)  
- The HMAC-SHA1 digest of the concatenation of "token + expire". The signing key is your ImageKit private API key. Must be computed on the server side. Example: `signature: "generated_signature"`

---

- **token**  
  (Required)  
- A unique value to identify and prevent replays. Typically a UUID (e.g., version 4). Example: `token: "unique_upload_token"`
  
  Check the [generating authentication parameters](#generating-authentication-parameters) section for more details on how to generate this value.

---

- **expire**  
  (Required)  
- A Unix timestamp in seconds, less than 1 hour in the future. Example: `expire: 1616161616`
  
  Check the [generating authentication parameters](#generating-authentication-parameters) section for more details on how to generate this value.

---

- **publicKey**  
  (Required)
- The public API key for your ImageKit account. This is used to identify the account making the upload request. Example: `publicKey: "your_public_api_key"`
  
  Check the [generating authentication parameters](#generating-authentication-parameters) section for more details on how to generate this value.

---

- **onProgress**
- A callback function to track the upload progress. It receives an event object with `loaded` and `total` properties. Example: `onProgress: (event) => console.log(event.loaded, event.total)`
  This is useful for showing upload progress to the user.

---
- **abortSignal**
- An optional `AbortSignal` object to abort the upload request. If the signal is already aborted, the upload will fail immediately.
  You can create an `AbortController` instance and pass its signal to the `upload()` function.

---

- **useUniqueFileName**
- Boolean flag to automatically generate a unique filename if set to true. Defaults to true. If false, the image is uploaded with the provided filename, replacing any existing file with the same name. Example: `useUniqueFileName: true`

---

- **folder**
- The folder path where the file will be stored, e.g., "/images/folder/". If the path doesn't exist, it is created on-the-fly. Example: `folder: "/images/uploads"`

---

- **isPrivateFile**
- Boolean to mark the file as private, restricting access to the original file URL. A private file requires signed URLs or named transformations for access. Defaults to false. Example: `isPrivateFile: false`

---

- **tags**
- Optionally set tags on the uploaded file. Can be a comma-separated string or an array of tags. Example: `tags: "summer,holiday"` or `tags: ["summer","holiday"]`

---

- **customCoordinates**
- A string in "x,y,width,height" format that defines the region of interest in an image (top-left coords and area size). Example: `customCoordinates: "10,10,100,100"`

---

- **responseFields**
- A comma-separated or array-based set of fields to return in the upload response. Example: `responseFields: "tags,customCoordinates"`

---

- **extensions**
- An array of extension objects to apply to the image, e.g., background removal, auto-tagging, etc. Example: `extensions: [{ name: "auto-tagging" }]`

---

- **webhookUrl**
- A webhook URL to receive the final status of any pending extensions once they've completed processing. Example: `webhookUrl: "https://example.com/webhook"`

---

- **overwriteFile**
- Defaults to true. If false, and "useUniqueFileName" is also false, the API immediately fails if a file with the same name/folder already exists. Example: `overwriteFile: true`

---

- **overwriteAITags**
- Defaults to true. If true, and an existing file is found at the same location, its AITags are removed. Set to false to keep existing AITags. Example: `overwriteAITags: true`

---

- **overwriteTags**
- Defaults to true. If no tags are specified in the request, existing tags are removed from overwritten files. Setting to false has no effect if the request includes tags. Example: `overwriteTags: true`

---

- **overwriteCustomMetadata**
- Defaults to true. If no customMetadata is specified in the request, existing customMetadata is removed from overwritten files. Setting to false has no effect if the request specifies customMetadata. Example: `overwriteCustomMetadata: true`

---

- **customMetadata**
- A stringified JSON or an object containing custom metadata fields to store with the file. Custom metadata fields must be pre-defined in your ImageKit configuration. Example: `customMetadata: {author: "John Doe"}`

---

- **transformation**
- Defines pre and post transformations to be applied to the file during upload. The SDK enforces certain validation rules for pre/post transformations. Example: `transformation: { pre: "w-200,h-200", post: [...] }`

---

- **xhr**
- An optional XMLHttpRequest instance for the upload. The SDK merges it with its own logic to handle progress events, etc. Example: `xhr: new XMLHttpRequest()`

---

- **checks**
- A string specifying the checks to be performed server-side before uploading to the media library, e.g., size or mime type checks. Example: `checks: "file.size' < '1MB'"`

{% /table %}

## Upload Example and Error Handling

The `.upload` function expects the following mandatory parameters:

- **`file` and `fileName`** – The file to be uploaded and the name you want to assign to it. The `file` value can be a `File` object, a base64-encoded string, or a URL.
- **Authentication parameters** – `token`, `signature`, `expire`, and `publicKey`.

Authentication is essential for secure file uploads from the browser. You should **never expose your private API key** in client-side code. Instead, generate these one-time authentication parameters on the **server side** and pass them to the client.

To simplify the process, all of our [backend SDKs](/quick-start-guides#back-end) include utility functions for generating authentication parameters.

### Upload Flow Overview

Here’s how the upload process using the SDK works:

1. **Client Request for Auth Parameters**  
   The client component calls an API route to fetch the authentication parameters.  
   You can implement your own application logic within this route to authenticate the user.  
   After that, use one of our backend SDKs to generate the required auth parameters and return them to the client.

2. **File Upload**  
   Once the client has the auth parameters, it can call the `.upload` function with the necessary data.

### Generating Authentication Parameters

The following example demonstrates how to create an API route that generates authentication parameters using the ImageKit [Node.js SDK](https://github.com/imagekit-developer/imagekit-nodejs). 

You can find your [private key](/api-keys#private-key) and [public key](/api-keys#public-key) in the ImageKit dashboard.

```js
const express = require('express');
const app = express();
const ImageKit = require('imagekit'); // Node.js SDK

const imagekit = new ImageKit({
  urlEndpoint: '<YOUR_IMAGEKIT_URL_ENDPOINT>', // https://ik.imagekit.io/your_imagekit_id
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

// allow cross-origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/auth', function (req, res) {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

app.listen(3000, function () {
  console.log('Live at Port 3000');
});
```

Now your client-side code can call this API route to retrieve the upload parameters.

The example below demonstrates how to use the `.upload` function in a client component to upload a file, including error handling for various upload scenarios. You can copy and paste this code into your client component and customize it as needed.

```js
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { useRef, useState } from "react";

// UploadExample component demonstrates file uploading using ImageKit's React SDK.
const UploadExample = () => {
    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */
    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    };

    return (
        <>
            {/* File input element using React ref */}
            <input type="file" ref={fileInputRef} />
            {/* Button to trigger the upload process */}
            <button type="button" onClick={handleUpload}>
                Upload file
            </button>
            <br />
            {/* Display the current upload progress */}
            Upload progress: <progress value={progress} max={100}></progress>
        </>
    );
};

export default UploadExample;
```

## Supported Transformations

The SDK assigns a name to each transformation parameter (e.g., `height` maps to `h`, `width` maps to `w`). If the property does not match any of the following supported options, it is added as is in the URL.

If you want to generate transformations without any modifications, use the `raw` parameter. For example, SDK doesn't provide a nice way to write [conditional transformations](/conditional-transformations), so you can use the `raw` parameter to add them as is.

Check [transformation documentation](/transformations) for complete reference on all transformations supported by ImageKit.

| Transformation Name        | URL Parameter                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| width                      | w                                                                                              |
| height                     | h                                                                                              |
| aspectRatio                | ar                                                                                             |
| quality                    | q                                                                                              |
| aiRemoveBackground         | e-bgremove (ImageKit powered)                                                                  |
| aiRemoveBackgroundExternal | e-removedotbg (Using third party)                                                              |
| aiUpscale                  | e-upscale                                                                                      |
| aiRetouch                  | e-retouch                                                                                      |
| aiVariation                | e-genvar                                                                                       |
| aiDropShadow               | e-dropshadow                                                                                   |
| aiChangeBackground         | e-changebg                                                                                     |
| crop                       | c                                                                                              |
| cropMode                   | cm                                                                                             |
| x                          | x                                                                                              |
| y                          | y                                                                                              |
| xCenter                    | xc                                                                                             |
| yCenter                    | yc                                                                                             |
| focus                      | fo                                                                                             |
| format                     | f                                                                                              |
| radius                     | r                                                                                              |
| background                 | bg                                                                                             |
| border                     | b                                                                                              |
| rotation                   | rt                                                                                             |
| blur                       | bl                                                                                             |
| named                      | n                                                                                              |
| dpr                        | dpr                                                                                            |
| progressive                | pr                                                                                             |
| lossless                   | lo                                                                                             |
| trim                       | t                                                                                              |
| metadata                   | md                                                                                             |
| colorProfile               | cp                                                                                             |
| defaultImage               | di                                                                                             |
| original                   | orig                                                                                           |
| videoCodec                 | vc                                                                                             |
| audioCodec                 | ac                                                                                             |
| grayscale                  | e-grayscale                                                                                    |
| contrastStretch            | e-contrast                                                                                     |
| shadow                     | e-shadow                                                                                       |
| sharpen                    | e-sharpen                                                                                      |
| unsharpMask                | e-usm                                                                                          |
| gradient                   | e-gradient                                                                                     |
| flip                       | fl                                                                                             |
| opacity                    | o                                                                                              |
| zoom                       | z                                                                                              |
| page                       | pg                                                                                             |
| startOffset                | so                                                                                             |
| endOffset                  | eo                                                                                             |
| duration                   | du                                                                                             |
| streamingResolutions       | sr                                                                                             |
| overlay                    | Generates the correct layer syntax for image, video, text, subtitle, and solid color overlays. |
| raw                        | The string provided in raw will be added in the URL as is.                                     |

## Handling Unsupported Transformations

If you specify a transformation parameter that is not explicitly supported by the SDK, it is added “as-is” in the generated URL. This provides flexibility for using new or custom transformations without waiting for an SDK update. However add `@ts-ignore` to avoid TypeScript errors for unsupported transformations, or add transformation as a string in the `raw` parameter.

For example:

```js
buildSrc({
  urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
  src: "/photo.jpg",
  transformation: [
    { unsupportedTransformation: "value" }
  ]
});
// Output: https://ik.imagekit.io/your_imagekit_id/photo.jpg?tr=unsupportedTransformation-value
```

## Overlay Reference

This SDK provides `overlay` as a transformation parameter. The overlay can be a text, image, video, subtitle, or solid color.

Overlays in ImageKit are applied using layers, allowing you to stack multiple overlays on top of each other. Each overlay can be styled and positioned independently. For more details, refer to the [layer documentation](/transformations#overlay-using-layers).

The SDK automatically generates the correct layer syntax for image, video, text, subtitle, and solid color overlays. You can also specify the overlay position, size, and other properties.

The table below outlines the available overlay configuration options:

{% table %}

- Option {% width="30%" %}
- Description and Example {% width="70%" %}

---

- **type**  
  (Required)
- Specifies the type of overlay. Supported values: `text`, `image`, `video`, `subtitle`, `solidColor`. Example: `type: "text"`

---

- **text**  
  (Required for text overlays)
- The text content to display. Example: `text: "ImageKit"`

---

- **input**  
  (Required for image, video, or subtitle overlays)
- Relative path to the overlay asset. Example: `input: "logo.png"` or `input: "overlay-video.mp4"`

---

- **color**  
  (Required for solidColor overlays)
- RGB/RGBA hex code or color name for the overlay color. Example: `color: "FF0000"`

---

- **encoding**
- Accepted values: `auto`, `plain`, `base64`. [Check this](#encoding-options) for more details. Example: `encoding: "auto"`

---

- **transformation**
- An array of transformation objects to style the overlay independently of the base asset. Each overlay type has its own set of supported transformations.
  - For example, for text overlays, you can specify `fontSize`, `fontColor`, `background`, etc. Example: `transformation: [{ fontSize: 20, fontColor: "FF0000" }]`. Check out the [text overlay transformations](#text-overlay-transformations) section for more options.
  - For image overlays, you can specify `width`, `height`, `radius`, etc. Example: `transformation: [{ width: 100, height: 100 }]`. Check [reference](/add-overlays-on-images#list-of-supported-image-transformations-in-image-layers) for complete list of transformations supported on image overlays.
  - For video overlays, you can specify `width`, `height`, `rotation`, etc. Example: `transformation: [{ width: 100, height: 100 }]`. Check [reference](/add-overlays-on-videos#list-of-transformations-supported-on-image-overlay) for complete list of transformations supported on video overlays.
  - For subtitle overlays, you can specify `fontSize`, `fontColor`, `background`, etc. Example: `transformation: [{ fontSize: 20, fontColor: "FF0000" }]`. Check out the [subtitle overlay transformations](#subtitle-overlay-transformations) section for more options.
  - For solid color overlays, you can specify `width`, `height`, `radius`, etc. Example: `transformation: [{ width: 100, height: 100 }]`. Check out the [solid color overlay transformations](#solid-color-overlay-transformations) section for more options.

---

- **position**
- Sets the overlay’s position relative to the base asset. Accepts an object with `x`, `y`, or `focus`. Example: `position: { x: 10, y: 20 }` or `position: { focus: "center" }`

---

- **timing**
- (For video base) Specifies when the overlay appears using `start`, `duration`, and `end` (in seconds); if both `duration` and `end` are set, `duration` is ignored. Example: `timing: { start: 5, duration: 10 }`

{% /table %}

### Encoding Options

Overlay encoding options define how the overlay input is converted for URL construction. When set to `auto`, the SDK automatically determines whether to use plain text or Base64 encoding based on the input content.

For text overlays:
- If `auto` is used, the SDK checks the text overlay input: if it is URL-safe, it uses the format `i-{input}` (plain text); otherwise, it applies Base64 encoding with the format `ie-{base64_encoded_input}`.
- You can force a specific method by setting encoding to `plain` (always use `i-{input}`) or `base64` (always use `ie-{base64}`).
- Note: In all cases, the text is percent-encoded to ensure URL safety.

For image, video, and subtitle overlays:
- The input path is processed by removing any leading/trailing slashes and replacing inner slashes with `@@` when `plain` is used.
- Similarly, if `auto` is used, the SDK determines whether to apply plain text or Base64 encoding based on the characters present.
- For explicit behavior, use `plain` or `base64` to enforce the desired encoding.

Use `auto` for most cases to let the SDK optimize encoding, and use `plain` or `base64` when a specific encoding method is required.

### Solid Color Overlay Transformations

| Option     | Description                                                                                                                                                                                                                   | Example             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| width      | Specifies the width of the solid color overlay block (in pixels or as an arithmetic expression).                                                                                                                              | `width: 100`        |
| height     | Specifies the height of the solid color overlay block (in pixels or as an arithmetic expression).                                                                                                                             | `height: 50`        |
| radius     | Specifies the corner radius of the solid color overlay block or shape. Can be a number or `"max"` for circular/oval shapes.                                                                                                   | `radius: "max"`     |
| alpha      | Specifies the transparency level of the solid color overlay. Supports integers from 1 (most transparent) to 9 (least transparent).                                                                                            | `alpha: 5`          |
| background | Specifies the background color of the solid color overlay. Accepts an RGB hex code, an RGBA code, or a standard color name.                                                                                                   | `background: "red"` |
| gradient   | Only works if base asset is an image. Creates a linear gradient with two colors. Pass `true` for a default gradient, or provide a string for a custom gradient. [Learn more](/effects-and-enhancements#gradient---e-gradient) | `gradient: true`    |

### Text Overlay Transformations

| Option         | Description                                                                                                                                                              | Example                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| width          | Specifies the maximum width (in pixels) of the overlaid text. The text wraps automatically, and arithmetic expressions are supported (e.g., `bw_mul_0.2` or `bh_div_2`). | `width: 400`               |
| fontSize       | Specifies the font size of the overlaid text. Accepts a numeric value or an arithmetic expression.                                                                       | `fontSize: 50`             |
| fontFamily     | Specifies the font family of the overlaid text. Choose from the supported fonts or provide a custom font.                                                                | `fontFamily: "Arial"`      |
| fontColor      | Specifies the font color of the overlaid text. Accepts an RGB hex code, an RGBA code, or a standard color name.                                                          | `fontColor: "FF0000"`      |
| innerAlignment | Specifies the inner alignment of the text when it doesn’t occupy the full width. Supported values: `left`, `right`, `center`.                                            | `innerAlignment: "center"` |
| padding        | Specifies the padding around the text overlay. Can be a single integer or multiple values separated by underscores; arithmetic expressions are accepted.                 | `padding: 10`              |
| alpha          | Specifies the transparency level of the text overlay. Accepts an integer between `1` and `9`.                                                                            | `alpha: 5`                 |
| typography     | Specifies the typography style of the text. Supported values: `b` for bold, `i` for italics, and `b_i` for bold with italics.                                            | `typography: "b"`          |
| background     | Specifies the background color of the text overlay. Accepts an RGB hex code, an RGBA code, or a color name.                                                              | `background: "red"`        |
| radius         | Specifies the corner radius of the text overlay. Accepts a numeric value or `max` for circular/oval shape.                                                               | `radius: "max"`            |
| rotation       | Specifies the rotation angle of the text overlay. Accepts a numeric value for clockwise rotation or a string prefixed with `N` for counterclockwise rotation.            | `rotation: 90`             |
| flip           | Specifies the flip option for the text overlay. Supported values: `h`, `v`, `h_v`, `v_h`.                                                                                | `flip: "h"`                |
| lineHeight     | Specifies the line height for multi-line text. Accepts a numeric value or an arithmetic expression.                                                                      | `lineHeight: 20`           |

### Subtitle Overlay Transformations

| Option      | Description                                                                                               | Example                 |
| ----------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| background  | Specifies the subtitle background color using a standard color name, RGB color code, or RGBA color code.  | `background: "blue"`    |
| fontSize    | Sets the font size of subtitle text.                                                                      | `fontSize: 16`          |
| fontFamily  | Sets the font family of subtitle text.                                                                    | `fontFamily: "Arial"`   |
| color       | Specifies the font color of subtitle text using standard color name, RGB, or RGBA color code.             | `color: "FF0000"`       |
| typography  | Sets the typography style of subtitle text. Supported values: `b`, `i`, `b_i`.                            | `typography: "b"`       |
| fontOutline | Specifies the font outline for subtitles. Requires an outline width and color separated by an underscore. | `fontOutline: "2_blue"` |
| fontShadow  | Specifies the font shadow for subtitles. Requires shadow color and indent separated by an underscore.     | `fontShadow: "blue_2"`  |

Height and Width Transformations
With ImageKit, you can resize images on the fly using the width and height properties. The SDK automatically generates the appropriate URL with the specified dimensions.


import { Image } from '@imagekit/react';

export default function Page() {
  return (
    <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
      transformation={[{ width: 500, height: 500 }]}
    />
  )
}