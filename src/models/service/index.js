/**
 * Service Model
 * @author ryan.bian
 */
const path = require('path');
const { app } = require('electron');
const { serviceStore } = require('../../service/index');
const Commander = require('../../service/commander');
const {
  ConfigerFolderPath,
  SHELL_NODE_MODULES_PATH,
} = require('../../utils/env');

const APP_PATH = app.getAppPath();

const serverScriptPath = path.join(APP_PATH, 'src/child_service/server');
const builderScriptPath = path.join(APP_PATH, 'src/child_service/builder');
const dllBuilderScriptPath = path.join(APP_PATH, 'src/child_service/dllBuilder');

class ServiceAPI {
  startServer(ctx) {
    const { root, port, configerName } = ctx.request.body;
    const _port = port || 3000;
    const { pid } = Commander.run(`node ${serverScriptPath} --port=${_port}`, {
      cwd: root,
      webContent: ctx.app.webContent,
      parseResult: false,
      env: {
        SHELL_NODE_MODULES_PATH,
        CONFIGER_FOLDER_PATH: ConfigerFolderPath,
        CONFIGER_NAME: configerName,
        NODE_ENV: 'development',
      },
      category: 'SERVER',
    });
    ctx.app.db.project.update(
      {
        projectPath: root,
      },
      {
        $inc: {
          serverStartCount: 1,
        },
      },
      { upsert: true }
    );
    ctx.body = ctx.app.responser({
      pid,
    }, true);
  }
  stop(ctx) {
    const { pid } = ctx.params;
    const _pid = Number(pid);
    let res;
    if (!serviceStore.has(_pid)) {
      res = ctx.app.responser(`process:${_pid} is not running.`, true);
    } else {
      serviceStore.delete(_pid);
      res = ctx.app.responser(null, true);
    }
    ctx.body = res;
  }
  startBuilder(ctx) {
    const { root, configerName, isDll } = ctx.request.body;
    let command;
    if (isDll) {
      command = `node ${dllBuilderScriptPath}`;
    } else {
      command = `node ${builderScriptPath}`;
    }
    const { pid } = Commander.run(command, {
      cwd: root,
      webContent: ctx.app.webContent,
      parseResult: false,
      env: {
        SHELL_NODE_MODULES_PATH,
        CONFIGER_FOLDER_PATH: ConfigerFolderPath,
        CONFIGER_NAME: configerName,
        NODE_ENV: 'production',
      },
      category: isDll ? 'DLL_BUILD' : 'BUILD',
    });
    ctx.app.db.project.update(
      {
        projectPath: root,
      },
      {
        $inc: {
          serverBuildCount: 1,
        },
      },
      { upsert: true }
    );
    ctx.body = ctx.app.responser({
      pid,
    }, true);
  }
}

module.exports = ServiceAPI;
