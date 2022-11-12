### A centralized crypto currency exchange

This project uses lerna

How to run locally:

- Clone the repo and run the `yarn initialize`
- Run the `yarn start:dev` command to start the services.

Project structure
  - packages/app 
  - packages/crypto-lib 

`crypto-lib` is a dependency of  `app` (and most likely other services). To ensure changes to crypto-lib are reflected across board.

run `yarn build` in crypto lib, then `yarn add file:../crypto-lib` in the project that has `crypto-lib` as a dependency. 


Services (view the docker-compose.local-yml for more details)
    - db (postgres database)
    - redis
    - app (the main application that serves api requests)
    - worker (a worker that handles background task and jobs, it runs the same application context as the app)

If there are ever permission issues when running the bash scripts, use `chmod` command to grant the required privileges.

```
cd /path/to/target
chmod +x the_file_name
```

Thanks [AskUbuntu](https://askubuntu.com/questions/409025/permission-denied-when-running-sh-scripts) 🚀🚀
