# A centralized crypto currency exchange

This project uses lerna

How to run locally:

- Clone the repo and run the `yarn install`, then run `yarn bootstrap`
- Run the `yarn start:dev` command to start the services.

Project structure

- packages/app
- packages/crypto-lib
- packages/db-lib

`*-lib`(e.g crypto-lib, db-lib) is a dependency of `app` (and most likely other services). To ensure changes to `*-lib` are reflected across board. e.g `crypto-lib`

run `yarn build` in `crypto-lib` , then `yarn add file:../crypto-lib` or `yarn add ../crypto-lib` (depending on which version of yarn you're running)—— in the project that has `crypto-lib` as a dependency.

Services (view the `docker-compose.local-yml` for more details)

    - db (postgres database)
    - redis
    - app (the main application that serves api requests)
    - worker (a worker that handles background task and jobs, it runs the same docker image as the app)

The app has two entry points.

1. `src/main.ts`
2. `src/worker.ts`

The application uses [typeorm](https://www.npmjs.com/package/typeorm/v/0.2.45) as the ORM.

Ensure to run the database migrations immediately after starting the services.

```sh
cd packages/db-lib/

yarn exec:typeorm migration:run
```

If there are ever permission issues when running the bash scripts, use `chmod` command to grant the required privileges.

```
cd /path/to/target
chmod +x the_file_name
```

Thanks [AskUbuntu](https://askubuntu.com/questions/409025/permission-denied-when-running-sh-scripts) 🚀🚀

## Running Blockchain nodes locally and funding accounts

### Ethereum

Download [ganache](https://trufflesuite.com/ganache/) and setup a workspace.
You can generate and fund accounts(addresses) from the GUI tool.

### Bitcoin (Regtest)

Navigate to [Nigiri Bitcoin](https://nigiri.vulpem.com/) and download it.
You can find more info about running the Nigiri toolbox on their [github page](https://github.com/vulpemventures/nigiri)

_Note: The worker service should have generated and saved a couple of addresses to the database. If this isn't the case, you need to ensure that the worker service is running._

In the `packages/app` folder, run the `yarn fund:btc:addresses` command to add funds to the btc addresses.
