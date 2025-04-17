import camelCase from "camelcase";

// Simplified types
interface NotionDatabase {
	results: Array<{
		properties: Record<string, any>;
	}>;
}

interface Options {
	camelcase?: boolean;
}

type NormalizedValue =
	| string
	| string[]
	| boolean
	| number
	| Record<string, string>
	| null;

export async function normalizeNotionDatabase(
	db: NotionDatabase,
	options: Options = {},
): Promise<Record<string, NormalizedValue>[]> {
	return db.results.map((page) => {
		const normalized: Record<string, NormalizedValue> = {};

		for (const [originalKey, value] of Object.entries(page.properties)) {
			const key = options.camelcase ? camelCase(originalKey) : originalKey;

			switch (value.type) {
				case "title":
				case "rich_text":
					const text =
						value.type === "title"
							? value.title?.[0]?.plain_text
							: value.rich_text?.[0]?.plain_text;
					normalized[key] = text ?? null;
					break;
				case "url":
					normalized[key] = value.url ?? null;
					break;
				case "select":
					normalized[key] = value.select?.name ?? null;
					break;
				case "multi_select":
					normalized[key] = value.multi_select?.map((item: any) => item.name) ?? [];
					break;
				case "checkbox":
					normalized[key] = value.checkbox ?? false;
					break;
				case "number":
					normalized[key] = value.number ?? null;
					break;
				case "date":
					normalized[key] = value.date?.start ?? null;
					break;
				case "status":
					normalized[key] = value.status?.name ?? null;
					break;
				case "email":
					normalized[key] = value.email ?? null;
					break;
				case "phone_number":
					normalized[key] = value.phone_number ?? null;
					break;
				case "created_time":
					normalized[key] = value.created_time ?? null;
					break;
				case "created_by":
					normalized[key] = value.created_by ?? null;
					break;
				case "last_edited_time":
					normalized[key] = value.last_edited_time ?? null;
					break;
				case "last_edited_by":
					normalized[key] = value.last_edited_by ?? null;
					break;
				case "id":
					normalized[key] = value.id ?? null;
					break;
				default:
					normalized[key] = value[value.type] ?? null;
			}
		}

		return normalized;
	});
}
