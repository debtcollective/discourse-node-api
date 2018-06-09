// import { SuperAgentRequest } from 'superagent';

export namespace discourseApi {
  declare function discourse(config: discourseApi.DiscourseApiConfiguration): discourseApi.DiscourseApi;
  export type discourse = typeof discourse & discourseApi.UtilsEnums;
  export type SuperAgentRequest = SuperAgentRequest;

  export interface DiscourseApi {
    tagGroups: TagGroups;
    categories: Categories;
    groups: Groups;
    topics: Topics;
    posts: Posts;
    enums: Enums;
    utils: Utils;
  }

  export interface UtilsEnums {
    enums: Enums;
    utils: Utils;
  }

  export interface DiscourseApiShuttle {
    authGet: (url: String, bodyProp?: String) => (params?: Params) => Promise<Object>;
    authPost: (url: String, bodyProp?: String) => (body?: Params) => Promise<Object>;
    authPut: (url: String, bodyProp?: String) => (body?: Params) => Promise<Object>;
    authDelete: (url: String, bodyProp?: String) => (params?: Params) => Promise<Object>;
  }

  export interface DiscourseApiConfiguration {
    api_key: string;
    api_username?: string;
    api_url: string;
  }

  export interface Params {
    [key: string]: string | number;
    asPropOf?: string;
  }

  export interface Req extends Request {
    toJSON(): { method: string; url: string; data: any; headers: Headers };
  }

  export interface Category {
    [key: string]: any;
    id: number;
  }

  export interface Topic {
    [key: string]: any;
    id: number;
    slug: string;
    post_stream: Post[];
  }

  export interface Group {
    [key: string]: any;
    id: number;
  }

  export interface Post {
    [key: string]: any;
    id: number;
  }

  export interface TagGroup {
    [key: string]: any;
    id: number;
  }

  export interface Categories {
    getAll(): Promise<Category[]>;
    get(id: number): Promise<Category>;
    create(c: Category): Promise<Category>;
    update(cat: Category): Promise<Category>;
    getAboutTopic(cat: Category): Promise<Topic>;
    permissionsMatch(seed: Category, existing: Category): boolean;
    stripPermissions(cat: Category): Category;
  }

  export interface Groups {
    get(params: Params): Promise<Group>;
    create(g: Group): Promise<Group>;
    update(g: Group): Promise<Group>;
  }

  export interface Posts {
    get(id: number): Promise<Post>;
    update(p: Post): Promise<Post>;
  }

  export interface TagGroups {
    getAll(): Promise<TagGroup[]>;
    update(tg: TagGroup): Promise<TagGroup>;
    create(tg: TagGroup): Promise<TagGroup>;
    differ(seed: TagGroup, existing: TagGroup): boolean;
  }

  export interface Topics {
    get(id: number): Promise<Topic>;
    update(t: Topic): Promise<Topic>;
    getPostId(t: Topic): number;
  }

  export interface Visibility {
    nobody: 0;
    onlyAdmins: 1;
    modsAndAdmins: 2;
    membersModsAndAdmins: 3;
    everyone: 99;
  }

  export interface Trust {
    new: 0;
    basic: 1;
    member: 2;
    regular: 3;
    leader: 4;
  }

  export interface Permission {
    create_reply_see: 1;
    reply_see: 2;
    see: 3;
  }

export interface Notification {
    muted: 0;
    regular: 1;
    tracking: 2;
    watching: 3;
    watching_first_post: 4
}

  export interface Enums {
    visibility: Visibility;
    trust: Trust;
    permission: Permission;
    notification: Notification;
  }

  export interface Utils {
    paramsAsPropsOf: (params: Params) => (asPropsOf: string) => Params;
    mapObjKeys: (mapKey: (key: string, value: any) => string) => (obj: any) => any;
    flattenObj: (obj: any) => any;
    splitProps: (predicate: (v: any, k: string | number) => boolean, obj: any) => { left: any; right: any };
  }
}
