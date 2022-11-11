### A centralized crypto currency exchange

This project uses lerna

How to run locally:

- Clone the repo and run the `yarn initialize`
- Run the `yarn start:dev` command to start the services.

Development workflow:

Establish symlinks using `yarn link` ([Read more here](https://classic.yarnpkg.com/lang/en/docs/cli/link/))
so changes to the crypto-lib package can reflect in real time in other packages

in the `crypto-lib` folder, run `yarn link`, then in any other package that has the `crypto-lib` package as a dependency
e.g `app`, run `yarn link "@cex/crypto-lib"`

If there are ever permission issues when running the bash scripts, use `chmod` command to grant the required privileges.

```
cd /path/to/target
chmod +x the_file_name
```

Thanks [AskUbuntu](https://askubuntu.com/questions/409025/permission-denied-when-running-sh-scripts) 🚀🚀
