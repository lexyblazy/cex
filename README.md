### A centralized crypto currency exchange

This project uses lerna

How to run locally:

- Clone the repo and run the `yarn initialize`
- Run the `yarn start:dev` command to start the services.

Project structure

- packages/app
- packages/crypto-lib

`crypto-lib` is a dependency of `app` (and most likely other services). To ensure changes to crypto-lib are reflected across board.

run `yarn build` in crypto lib, then `yarn add file:../crypto-lib` in the project that has `crypto-lib` as a dependency.

Services (view the `docker-compose.local-yml` for more details)

    - db (postgres database)
    - redis
    - app (the main application that serves api requests)
    - worker (a worker that handles background task and jobs, it runs the same application context as the app)

The app has two entry points.

1. `src/main.ts`
2. `src/worker.ts`

The application uses [typeorm](https://www.npmjs.com/package/typeorm/v/0.2.45) as the ORM.

Ensure to run the database migrations immediately after starting the services.

```sh
cd packages/app/

yarn exec:typeorm migration:run
```

If there are ever permission issues when running the bash scripts, use `chmod` command to grant the required privileges.

```
cd /path/to/target
chmod +x the_file_name
```

Thanks [AskUbuntu](https://askubuntu.com/questions/409025/permission-denied-when-running-sh-scripts) 🚀🚀
