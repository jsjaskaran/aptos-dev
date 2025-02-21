import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getOpenaiApiKey, getQdrantApiKey, getQdrantCollectionName, getQdrantUrl } from "../config";

const retrieveSchema = z.object({
	query: z.string()
});

const OPENAI_API_KEY = getOpenaiApiKey();
export const retrieve = tool(
	async ({
		query
	}) => {
        console.log('retrieve: ', query)
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: OPENAI_API_KEY
        });
		const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
			url: getQdrantUrl(),
			collectionName: getQdrantCollectionName(),
			apiKey: getQdrantApiKey()
		});
		const retrievedDocs = await vectorStore.similaritySearch(query, 2);
		const serialized = retrievedDocs
			.map(
				(doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
			)
			.join("\n");
		return [serialized, retrievedDocs];
	}, {
		name: "retrieve",
		description: "Retrieve information related to a query.",
		schema: retrieveSchema,
		responseFormat: "content_and_artifact",
	}
);