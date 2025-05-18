# Simple Photo Gallery
The aim of this project is to create a somewhat private and minimalistic photo gallery:
- inspired by [Vercel's Image Gallery Starter](https://nextjsconf-pics.vercel.app/)
- features 2 galleries, a gallery where users can upload images to and a gallery that contains pre-uploaded photos.
- that leverages on serverless architecture i.e [Cloudflare Pages and NextJS](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- that allows user access only through unique link provided.
- that allows photos uploads to the event gallery for permitted users only.
- Devcontainer was used to develop this project, do take note of the extra feature to download i.e wrangler.
- Additionally, follow this [article](https://zenn.dev/frog/articles/f77b80a0d78497) to do `wrangler login` inside a devcontainer

## Sample Images of the Application
- Rejects "unauthenticated" visits by default
<img src = https://github.com/user-attachments/assets/7091eb04-4143-4891-8f34-9ad937b109d6 width="900">

- Gallery application with upload function and image carousel.
<img src = https://github.com/user-attachments/assets/6ebd0e61-2aed-4fa0-aacb-724112c9dc5f width="400">
<img src = https://github.com/user-attachments/assets/3c873525-1612-4f9a-8a02-4e99232e8e0e width="400">

## Deploying and Testing Locally
The following are settings required to test the Project Locally.

### `.devcontainer/devcontainer.json` and `package.json` Settings
There are 2 modes which you want to test locally:
- serving at 0.0.0.0 [so that we can access on local LAN from other devices]
- serving at 127.0.0.1 [app will only be accesible on localhost]


`.devcontainer/devcontainer.json`
- to be able to access app on local LAN, we will need to uncomment the `appPort` to expose the devcontainer port to `0.0.0.0`.
- We will then need to rebuild the devcontainer.
```
{
	"name": "Node.js & TypeScript",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
	"features": {
		"ghcr.io/devcontainers-extra/features/cloudflare-wrangler:1": {}
	},
	//"appPort": ["8788:8788"] // uncomment this when you to serve to 0.0.0.0 and we will need to use npm run serve instead as well 
}
```


`package.json`
- `"serve"` is not the default script addded, we will need this so that we can access the app on local LAN for testing  
```
	"scripts": {
    ...truncated...
		"preview": "npm run pages:build && wrangler pages dev --ip 127.0.0.1",
		"serve": "npm run pages:build && wrangler pages dev --ip 0.0.0.0",
    ...truncated...
	}
```

### KV Binding Local
Step 1 : Create a local KV pair using the following command
```
wrangler kv key put --binding {namespace} \
'{key}' '{value}' \
--local
```

Step 2: Change the `{namespace}` in `line 20` of `/app/api/auth/[uniqueid]/route.ts` to the relevant value set above.
```
  const kvNamespace = getRequestContext().env.{namespace};
```

Step 3: Add the namespace interface in `env.d.ts` to the relevant `namespace` value. 
```
interface CloudflareEnv {
    {namespace}: KVNamespace;
}
```

Step 4: Add the value in `wrangler.jsonrc` as below.  
```
	"kv_namespaces": [
    {
      "binding": "namespace",
      "id": "{namespace_id}"
    }
```


### Local Secrets `.dev.vars` 
For local development, we will need to store the secrets in `.dev.vars`. Please refer to [Remote Secrets](#remote-secrets) for secrets deployment.

- `R2_API_ENDPOINT` : value of endpoint for R2 object storage 
- `R2_TOKEN_VALUE` : value of R2 Token
- `R2_ACCESS_KEY` : value of R2 Access Key
- `R2_SECRET_KEY` : value of R2 Secret Key
- `R2_BUCKET_NAME` : value of R2 Bucket Name 
- `SECRET` : value of secret used to sign and verify JWT
- `ENCKEY` : value of encryption Key for symmetric encryption of JWT 
- `EVENT_ID` : value of event id which will be used in JWT

## Deploying to Pages
To deploy to Pages, we will simply need to login first using `wrangler login` before running: 

```
npm run deploy
```

The scripts will be executed, and we simply need to follow the instructions by cloudflare.

### Remote KV Binding
- First, login to `dash.cloudflare.com`
- Secondly, navigate to `Storage & Databases` -> `KV` -> "Create".
- Thirdly, click on the create button, make sure the names are the same as the local KV.
- Click on the newly created `KV namespace` -> `KV Pairs` -> "Add Entry". 

### Remote Secrets
- First, login to `dash.cloudflare.com`
- Secondly, navigate to `Compute Workers` -> `Workers & Pages` -> `app-name` -> `Settings` -> `Variables and Secrets`
- Thirdly, click on "Add" button 
- Lastly, copy and paste values in `.dev.vars` if they are the same. Otherwise, we can still copy and paste, but change the value accordingly.

## Other Configurations
This section details the other configurations that is required for the application to work.

### JWT Expiration and Encyrption Algorithm
- The configurations for JWT Expiration Time and Encryption Algorithm used is found in the `/app/utils/jwtEncryption.ts`.

### Background Colour
- Configuration to change the webpage background colour is found in `/app/global.css`

### Allowing Images to be Displayed
- Images will not be displayed due to CORS by default, we will need to whitelist the allowed domains in `next.config.ts`
