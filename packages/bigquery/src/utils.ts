import mapKeys from "lodash/mapKeys";
import snakeCase from "lodash/snakeCase";

export function mapKeysToSnakeCase<T extends Record<string, any>>(obj: T): T {
    return mapKeys(obj, (_, key) => snakeCase(key)) as T;
}
