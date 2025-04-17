import { describe, expect, it } from "vitest";
import { normalizeNotionDatabase } from "../src";

describe("normalizeNotionDatabase", () => {
	const mockDatabase = {
		results: [
			{
				properties: {
					Title: {
						type: "title",
						title: [{ plain_text: "Test Title" }],
					},
					Description: {
						type: "rich_text",
						rich_text: [{ plain_text: "Test Description" }],
					},
					Link: {
						type: "url",
						url: "https://example.com",
					},
					Category: {
						type: "select",
						select: { name: "Option1" },
					},
					Tags: {
						type: "multi_select",
						multi_select: [{ name: "Tag1" }, { name: "Tag2" }],
					},
					Active: {
						type: "checkbox",
						checkbox: true,
					},
					Count: {
						type: "number",
						number: 42,
					},
					StartDate: {
						type: "date",
						date: { start: "2023-01-01" },
					},
					Status: {
						type: "status",
						status: { name: "In Progress" },
					},
					Email: {
						type: "email",
						email: "test@example.com",
					},
					Phone: {
						type: "phone_number",
						phone_number: "123-456-7890",
					},
					CreatedTime: {
						type: "created_time",
						created_time: "2023-01-01T12:00:00Z",
					},
					CreatedBy: {
						type: "created_by",
						created_by: { id: "user1" },
					},
					LastEditedTime: {
						type: "last_edited_time",
						last_edited_time: "2023-01-02T12:00:00Z",
					},
					LastEditedBy: {
						type: "last_edited_by",
						last_edited_by: { id: "user2" },
					},
					Id: {
						type: "id",
						id: "page-123",
					},
				},
			},
			{
				properties: {
					Title: {
						type: "title",
						title: [],
					},
					Description: {
						type: "rich_text",
						rich_text: [],
					},
				},
			},
		],
	};

	it("should normalize all property types correctly", async () => {
		const result = await normalizeNotionDatabase(mockDatabase);
		const firstPage = result[0];

		expect(firstPage.Title).toBe("Test Title");
		expect(firstPage.Description).toBe("Test Description");
		expect(firstPage.Link).toBe("https://example.com");
		expect(firstPage.Category).toBe("Option1");
		expect(firstPage.Tags).toEqual(["Tag1", "Tag2"]);
		expect(firstPage.Active).toBe(true);
		expect(firstPage.Count).toBe(42);
		expect(firstPage.StartDate).toBe("2023-01-01");
		expect(firstPage.Status).toBe("In Progress");
		expect(firstPage.Email).toBe("test@example.com");
		expect(firstPage.Phone).toBe("123-456-7890");
		expect(firstPage.CreatedTime).toBe("2023-01-01T12:00:00Z");
		expect(firstPage.CreatedBy).toEqual({ id: "user1" });
		expect(firstPage.LastEditedTime).toBe("2023-01-02T12:00:00Z");
		expect(firstPage.LastEditedBy).toEqual({ id: "user2" });
		expect(firstPage.Id).toBe("page-123");
	});

	it("should handle empty title and rich_text with null", async () => {
		const result = await normalizeNotionDatabase(mockDatabase);
		const secondPage = result[1];

		expect(secondPage.Title).toBe(null);
		expect(secondPage.Description).toBe(null);
	});

	it("should apply camelCase to keys when option is enabled", async () => {
		const result = await normalizeNotionDatabase(mockDatabase, { camelcase: true });
		const firstPage = result[0];

		expect(firstPage.title).toBe("Test Title");
		expect(firstPage.description).toBe("Test Description");
		expect(firstPage.startDate).toBe("2023-01-01");
		expect(firstPage.createdTime).toBe("2023-01-01T12:00:00Z");
	});

	it("should not apply camelCase to keys when option is disabled", async () => {
		const result = await normalizeNotionDatabase(mockDatabase, { camelcase: false });
		const firstPage = result[0];

		expect(firstPage.Title).toBe("Test Title");
		expect(firstPage.Description).toBe("Test Description");
		expect(firstPage.StartDate).toBe("2023-01-01");
		expect(firstPage.CreatedTime).toBe("2023-01-01T12:00:00Z");
	});

	it("should handle empty database", async () => {
		const emptyDatabase = { results: [] };
		const result = await normalizeNotionDatabase(emptyDatabase);
		expect(result).toEqual([]);
	});
});
