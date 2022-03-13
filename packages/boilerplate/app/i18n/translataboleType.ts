import * as translations from "./en.json";
export type RecursiveKeyof<T, Prefix extends string = never> =
  // If T matches any of the types in the union below, we return accumulated prefixes.
  // We must exclude functions, otherwise we get infinite recursion 'cause functions have
  // properties that are functions: i.e. myFunc.call.call.call.call.call.call...
  T extends
    | string
    | number
    | bigint
    | boolean
    | null
    | undefined
    | ((...args: any) => any)
    ? Prefix // return acc prefixes
    : // If T doesn't match, we care about it's properties. We use a mapped type to rewrite
      // T.
      // If T = { foo: { bar: string } }, then this mapped type produces
      // "foo.bar"
      {
        // For each property on T, we remap the value with
        [K in keyof T & string]: [Prefix] extends [never] // No prefixes, pass curr as root prefix
          ? RecursiveKeyof<T[K], K>
          : // previousPrefix.currentPrefix
            RecursiveKeyof<T[K], `${Prefix}.${K}`>;
        // Once we've mapped T, we only care about the values of its properties
        // so we tell typescript to produce the union of the mapped types keys.
        // { foo: "1", bar: "2" }["foo" | "bar"] generates "1" | "2"
      }[keyof T & string];
export type TranslateableStrings = RecursiveKeyof<typeof translations>;
