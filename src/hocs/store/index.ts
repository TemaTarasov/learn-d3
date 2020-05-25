interface Store {
  get(name: string): any;

  define<Name, Data>(name: Name, data: Data): Data;
}

export default (type: string): Store => (
  new class implements Store {
    protected store: Map<any, any> = new Map<string, any>();

    get<Name>(name: Name): any {
      if (!this.store.has(name)) {
        console.warn(`In "${type}"[get]: "${name}" is not exists!`);
      }

      return this.store.get(name);
    }

    define<Name, Data>(name: Name, data: Data): Data {
      if (this.store.has(name)) {
        console.warn(`In "${type}"[define]: "${name}" already exists. Please use different key!`);

        return this.get(name);
      }

      this.store.set(name, data);
      return data;
    }
  }()
);
