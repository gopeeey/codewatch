import {
  PluginName,
  RegistryInterface,
  RepoDataType,
  pluginLib,
} from "./types";

export class Registry implements RegistryInterface {
  private _baseUrl: string = "https://registry.npmjs.org/";

  async getCore() {
    const response = await fetch(this._url("codewatch-core"));
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.json();
    return data as unknown as RepoDataType;
  }

  async getPlugin(name: PluginName) {
    let plugin = pluginLib[name];
    if (!plugin) throw new Error("Unsupported plugin " + name);

    const response = await fetch(this._url(plugin));
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.json();
    return data as unknown as RepoDataType;
  }

  async getInstaller() {
    const response = await fetch(this._url("codewatch-installer"));
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.json();
    return data as unknown as RepoDataType;
  }

  private _url(name: string) {
    if (name[0] === "@" && name.indexOf("/") !== -1) {
      name = "@" + encodeURIComponent(name.slice(1));
    }
    return this._baseUrl + name;
  }
}

const reg = new Registry();
