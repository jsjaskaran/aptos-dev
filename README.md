# 🚀 aptos-bot - An AI-powered search engine for aptos 🔎

### Setup steps

1. Make a copy of sample.config.toml file as config.toml file.
2. Fill in the values for OPENAI API_KEY.
3. Fill in the values for QDRANT keys to access the vector database.
4. Lastly, fill in the values for LANGFUSE to have monitoring capabilities.
5. Open up **two** different terminals - One for backend and other for frontend.
6. In first terminal run `npm run dev`
7. In the second terminal run the following commands 

	> cd ui
	> npm run dev
8. This should start the servers.
9. You can now visit `http://localhost:3000` to interact with the bot.
