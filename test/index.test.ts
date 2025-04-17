import camelCase from "camelcase";
import { describe, expect, it } from "vitest";
import { normalizeNotionDatabase } from "../src";

describe("normalizeNotionDatabase", () => {
	const mockDatabase = {
		results: [
			{
				properties: {
					"Project Title": {
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
					"Start Date": {
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
					"Created Time": {
						type: "created_time",
						created_time: "2023-01-01T12:00:00Z",
					},
					"Created By": {
						type: "created_by",
						created_by: { id: "user1" },
					},
					"Last Edited Time": {
						type: "last_edited_time",
						last_edited_time: "2023-01-02T12:00:00Z",
					},
					"Last Edited By": {
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
					"Project Title": {
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

		expect(firstPage["Project Title"]).toBe("Test Title");
		expect(firstPage.Description).toBe("Test Description");
		expect(firstPage.Link).toBe("https://example.com");
		expect(firstPage.Category).toBe("Option1");
		expect(firstPage.Tags).toEqual(["Tag1", "Tag2"]);
		expect(firstPage.Active).toBe(true);
		expect(firstPage.Count).toBe(42);
		expect(firstPage["Start Date"]).toBe("2023-01-01");
		expect(firstPage.Status).toBe("In Progress");
		expect(firstPage.Email).toBe("test@example.com");
		expect(firstPage.Phone).toBe("123-456-7890");
		expect(firstPage["Created Time"]).toBe("2023-01-01T12:00:00Z");
		expect(firstPage["Created By"]).toEqual({ id: "user1" });
		expect(firstPage["Last Edited Time"]).toBe("2023-01-02T12:00:00Z");
		expect(firstPage["Last Edited By"]).toEqual({ id: "user2" });
		expect(firstPage.Id).toBe("page-123");
	});

	it("should handle empty title and rich_text with null", async () => {
		const result = await normalizeNotionDatabase(mockDatabase);
		const secondPage = result[1];

		expect(secondPage["Project Title"]).toBe(null);
		expect(secondPage.Description).toBe(null);
	});

	it("should apply camelCase to keys when option is enabled", async () => {
		const result = await normalizeNotionDatabase(mockDatabase, { camelcase: true });
		const firstPage = result[0];

		const originalKeys = Object.keys(mockDatabase.results[0].properties);
		const expectedCamelCaseKeys = originalKeys.map((key) => camelCase(key));
		const actualKeys = Object.keys(firstPage);

		expect(actualKeys).toEqual(expectedCamelCaseKeys);

		// Optionally, check a few specific keys to ensure they are camelCased
		expect(actualKeys).toContain("projectTitle"); // "Project Title" -> "projectTitle"
		expect(actualKeys).toContain("startDate"); // "Start Date" -> "startDate"
		expect(actualKeys).toContain("createdTime"); // "Created Time" -> "createdTime"
		expect(actualKeys).toContain("createdBy"); // "Created By" -> "createdBy"
	});

	it("should not apply camelCase to keys when option is disabled", async () => {
		const result = await normalizeNotionDatabase(mockDatabase, { camelcase: false });
		const firstPage = result[0];

		const originalKeys = Object.keys(mockDatabase.results[0].properties);
		const actualKeys = Object.keys(firstPage);

		expect(actualKeys).toEqual(originalKeys);

		// Optionally, check a few specific keys to ensure they are not camelCased
		expect(actualKeys).toContain("Project Title");
		expect(actualKeys).toContain("Start Date");
		expect(actualKeys).toContain("Created Time");
	});

	it("should handle empty database", async () => {
		const emptyDatabase = { results: [] };
		const result = await normalizeNotionDatabase(emptyDatabase);
		expect(result).toEqual([]);
	});
});
