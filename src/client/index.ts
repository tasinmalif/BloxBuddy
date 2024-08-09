import {
  Client,
  Collection,
  ClientOptions,
  PermissionsBitField,
  REST,
  Routes,
} from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "path";
import { iEvent, iCommand, iButton, iConfig } from "../interface";
import { config, LogManager } from "../util";

export default class Bot extends Client {
  public events: Collection<string, iEvent>;
  public commands: Collection<string, iCommand>;
  public buttons: Collection<string, iButton>;
  public logger: LogManager;
  public config: iConfig;
  private __commands: object[];
  private __guild_commands: object[];

  constructor(options: ClientOptions) {
    super(options);
    this.events = new Collection<string, iEvent>();
    this.commands = new Collection<string, iCommand>();
    this.buttons = new Collection<string, iButton>();
    this.config = config;
    this.__commands = [];
    this.__guild_commands = [];
    this.logger = new LogManager();
  }

  /**
   * @description Starts the bot
   * @returns void
   */
  async start(): Promise<void> {
    try {
      await this.__handleCommands();
      await this.__handleEvents();
      await this.__handleButtons();
      await this.__registerApplicationCommands();
      this.login(this.config.secrets.token).then(() => {
        this.logger.info("bot logged in successfully", "client", true);
      });
    } catch (err) {
      console.log(err);
      this.logger.error(err, "start", true);
    }
  }

  /**
   * @description Handle events
   * @returns void
   */
  private async __handleEvents(): Promise<void> {
    const eventPath = readdirSync(join(__dirname, "..", "events"));
    eventPath.forEach(async (dir) => {
      const eventFiles = readdirSync(`./dist/events/${dir}`).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
      );

      for (const file of eventFiles) {
        const event: iEvent = (await import(`../events/${dir}/${file}`))
          .default;
        if (event && event.name) {
          this.events.set(event.name, event);
          if (event.once) {
            this.once(event.name, (...args) => event.execute(this, ...args));
          } else {
            this.on(event.name, (...args) => event.execute(this, ...args));
          }
        }
      }
    });
  }

  /**
   * @description Handle commands
   * @returns void
   */
  private async __handleCommands(): Promise<void> {
    const commandPath = readdirSync(join(__dirname, "..", "commands"));
    for (const dir of commandPath) {
      if (dir === "subcmd") {
        continue;
      }
      const commandFiles = readdirSync(`./dist/commands/${dir}`).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command: iCommand = (await import(`../commands/${dir}/${file}`))
          .default;
        if (!command || !command.name || !command.description) {
          this.logger.warn(`missing command parameters in ${file}!`, "client");
          continue;
        } else {
          this.commands.set(command.name, command);
          const commandObject = {
            name: command.name.toLowerCase(),
            description: command.description.toLowerCase(),
            type: command.type || 1,
            options: command.options ?? null,
            default_member_permissions: command.permissions
              ? PermissionsBitField.resolve(
                  command.permissions.member
                ).toString()
              : PermissionsBitField.resolve(["SendMessages"]).toString(),
          };
          if (command.slash) {
            if (command.secret) {
              this.__guild_commands.push(commandObject);
            } else {
              this.__commands.push(commandObject);
            }
          }
        }
      }
    }
  }

  /**
   * @description Handle sub-commands
   * @returns void
   */
  public async subcommand(client: this, interaction: any): Promise<void> {
    try {
      let commandPath: string;

      // Check if there is a subcommand group
      if (interaction.options.getSubcommandGroup()) {
        commandPath = join(
          __dirname,
          "..",
          "commands",
          "subcmd",
          `${interaction.commandName}`,
          `${interaction.options.getSubcommandGroup()}`,
          `${interaction.options.getSubcommand()}`
        );
      } else {
        commandPath = join(
          __dirname,
          "..",
          "commands",
          "subcmd",
          `${interaction.commandName}`,
          `${interaction.options.getSubcommand()}`
        );
      }

      const cmdModule = await import(commandPath);
      await cmdModule.default(client, interaction);
    } catch (err) {
      this.logger.error(err, "sub-cmd");
    }
  }

  /**
   * @description Handle buttons
   *
   */
  private async __handleButtons(): Promise<void> {
    const buttonPath = readdirSync(
      join(__dirname, "../components/", "buttons")
    );
    buttonPath?.forEach(async (dir) => {
      const buttonFiles = readdirSync(
        `./dist/components/buttons/${dir}`
      ).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of buttonFiles) {
        const button: iButton = (
          await import(`../components/buttons/${dir}/${file}`)
        ).default;
        if (button && button.id) {
          this.buttons.set(button.id, button);
        } else {
          this.logger.warn(`missing id in button file ${file}`, "client");
        }
      }
    });
  }

  /**
   * @description Register application commands
   * @returns void
   */
  private async __registerApplicationCommands(): Promise<void> {
    const rest = new REST({ version: "10" }).setToken(
      this.config.secrets.token
    );
    (async () => {
      try {
        if (this.config.secrets.mode === "test") {
          this.logger.warn("bot is in developer mode", "client", true);
          await rest.put(
            Routes.applicationGuildCommands(
              this.config.secrets.id,
              this.config.secrets.guild
            ),
            {
              body: [...this.__commands, ...this.__guild_commands],
            }
          );
        } else if (this.config.secrets.mode === "prod") {
          await rest.put(
            Routes.applicationGuildCommands(
              this.config.secrets.id,
              this.config.secrets.guild
            ),
            {
              body: this.__guild_commands,
            }
          );
          this.logger.warn("bot is in production mode", "client", true);
          await rest.put(Routes.applicationCommands(this.config.secrets.id), {
            body: this.__commands,
          });
        }
        this.logger.info("application commands reloaded", "client");
      } catch (err) {
        this.logger.error(err, "register-cmd");
      }
    })();
  }
}
