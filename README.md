# normalize-notion-database

A lightweight utility to normalize Notion database entries into a simple, usable format.

> !IMPORTANT
> It is specifically built to work with data retrieved using the `@notionhq/client` package.

[![CI](https://github.com/rocktimsaikia/normalize-notion-database/actions/workflows/main.yml/badge.svg)](https://github.com/rocktimsaikia/normalize-notion-database/actions/workflows/main.yml) [![npm](https://img.shields.io/npm/v/normalize-notion-database?color=brightgreen)](https://www.npmjs.com/package/normalize-notion-database)

## Installation

Install the package with your package manager of choice:

```sh
# npm
npm install normalize-notion-database

# yarn
yarn add normalize-notion-database

# pnpm
pnpm add normalize-notion-database
```

## Usage

Here’s a quick example to get you started:

```typescript
import { Client } from "@notionhq/client";
import { normalizeNotionDatabase } from 'normalize-notion-database';

// 1. Initialize the Notion client.
const notion = new Client({
	auth: process.env.NOTION_AUTH_TOKEN,
});

// 2. Query the Notion database.
const database = await notion.databases.query({
	database_id: process.env.NOTION_DATABASE_ID_PROJECTS,
});

// 3. Normalize the data into a usable format.
const normalizedData = await normalizeNotionDatabase(notionData, { camelcase: true });

console.log(normalizedData);
// => [{ projectTitle: 'My Project', currentStatus: 'In Progress', tags: ['Tag1', 'Tag2'] }]
```


## API

### `normalizeNotionDatabase(db, options)`

Normalizes a Notion database object into an array of simplified JavaScript objects.

#### Parameters

##### `db`

> Type: `NotionDatabase` (or `Record<string, any>`)  
> The raw Notion database object containing a `results` array of pages with `properties`.

##### `options`

> Type: `{ camelcase?: boolean }`  
> Optional configuration object.  
> - `camelcase`: If `true`, converts property keys to camelCase (e.g., `Start Date` becomes `startDate`). Defaults to `false`.

#### Returns

> Type: `Promise<Record<string, string | string[] | boolean | number | Record<string, string> | null>[]>`  
> A promise that resolves to an array of normalized objects, where each object represents a Notion page with simplified property values.

## Supported Property Types

The package normalizes the following Notion property types into simple values:

- `title` → `string | null`
- `rich_text` → `string | null`
- `url` → `string | null`
- `select` → `string | null`
- `multi_select` → `string[]`
- `checkbox` → `boolean`
- `number` → `number | null`
- `date` → `string | null` (returns the `start` date)
- `status` → `string | null`
- `email` → `string | null`
- `phone_number` → `string | null`
- `created_time` → `string | null`
- `created_by` → `Record<string, string> | null`
- `last_edited_time` → `string | null`
- `last_edited_by` → `Record<string, string> | null`
- `id` → `string | null`

## License

[MIT](./LICENSE) License © [Rocktim Saikia](https://rocktimsaikia.dev) 2025
