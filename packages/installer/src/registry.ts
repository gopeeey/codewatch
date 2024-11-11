import { RegistryInterface, RepoDataType } from "./types";

export class Registry implements RegistryInterface {
  private baseUrl: string = "https://registry.npmjs.org/";

  async get(name: string) {
    const response = await fetch(this.url(name));
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.json();
    return data as unknown as RepoDataType;
  }

  url(name: string) {
    if (name[0] === "@" && name.indexOf("/") !== -1) {
      name = "@" + encodeURIComponent(name.slice(1));
    }
    return this.baseUrl + name;
  }
}

const reg = new Registry();
