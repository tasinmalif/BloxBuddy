import chalk from "chalk";
import { DateTime } from "luxon";
import * as fs from "node:fs";
import * as path from "node:path";

enum LogState {
  log = "LOG",
  info = "INFO",
  warn = "WARN",
  error = "ERROR",
}

export default class LogManager {
  currentTime(): string {
    return DateTime.now().toFormat("tt");
  }

  log(
    text: string,
    pre: LogState | string | undefined = undefined,
    writeFile: boolean = false,
    color: string
  ): string {
    const logString = [`[${this.currentTime()}]`];
    if (pre !== undefined) {
      logString.push(
        Array.isArray(pre)
          ? pre.map((p) => `[${p.toUpperCase()}]`).join("")
          : `[${pre.toUpperCase()}]`
      );
    }
    logString.push(text.toLowerCase());
   /*  if (writeFile) {
      this.writeToLog(logString, pre || LogState.log);
    } */

    if (color) {
      console.log(chalk[color](logString.join(" ")));
    } else {
      console.log(logString.join(" "));
    }

    return logString.join(" ");
  }

  info(
    text: string,
    pre: LogState | string | undefined = undefined,
    writeFile: boolean = false
  ): string {
    return this.log(text, pre || LogState.info, writeFile, "grey");
  }

  put(
    text: string,
    pre: LogState | string | undefined = undefined,
    writeFile: boolean = false
  ): string {
    return this.log(text, pre || LogState.log, writeFile, "green");
  }

  warn(
    text: string,
    pre: LogState | string | undefined = undefined,
    writeFile: boolean = false
  ): string {
    return this.log(text, pre || LogState.warn, writeFile, "yellow");
  }

  error(
    err: Error | unknown,
    pre: LogState | string | undefined = undefined,
    writeFile: boolean = true
  ): string {
    return this.log(`${err}\n`, pre || LogState.error, writeFile, "red");
  }

  /* writeToLog(logString: string[], pre: LogState | string): void {
   try {
    const today = DateTime.now().toFormat("dd-MM-yy");
    const logDir = "logs";

    const projectRoot = path.resolve(__dirname, "../../");
    if (!fs.existsSync(path.join(projectRoot, logDir))) {
      fs.mkdirSync(path.join(projectRoot, logDir));
    }

    const filePath = path.join(
      projectRoot,
      logDir,
      `${today} [${pre.toLowerCase()}].log`
    );

    fs.writeFileSync(filePath, `${logString.join(" ")}\n`);
   } catch (err) {
     console.log(`[${this.currentTime}] [LOGGER] could not write files.`)
   }
  } */
}