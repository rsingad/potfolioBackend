const axios = require('axios');
const Groq = require('groq-sdk');
const News = require('../models/News');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const fetchAndTransformNews = async () => {
  try {
    console.log("Fetching news from external API...");
    const response = await axios.get('https://saurav.tech/NewsAPI/top-headlines/category/technology/in.json');
    const articles = response.data.articles.slice(0, 10); // Process top 10 articles

    for (const article of articles) {
      // Check if article already exists
      const existingNews = await News.findOne({ url: article.url });
      if (existingNews) continue;

      console.log(`Transforming article: ${article.title}`);

      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a professional tech blogger and subject matter expert. Your goal is to write a completely original, insightful, and engaging tech article based on provided facts. 
              
              Rules:
              1. Do NOT copy the input text. Use it only for factual reference.
              2. Write in a professional yet conversational tone.
              3. The article should be "Fresh Content" meaning it should have a unique perspective to avoid any copyright issues.
              4. Return the result in JSON format with three keys: 
                 - "title": A catchy, SEO-optimized title.
                 - "description": A brief 2-line summary.
                 - "content": A detailed long-form article (at least 3-4 paragraphs) with expert-level insights.
                 - "keywords": A comma-separated list of 10-15 highly relevant SEO keywords for this specific topic.`,
            },
            {
              role: 'user',
              content: `News Facts:
              Title: ${article.title}
              Source Summary: ${article.description}`,
            },
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
        });

        const transformedData = JSON.parse(chatCompletion.choices[0].message.content);

        const newNews = new News({
          title: transformedData.title,
          description: transformedData.description,
          content: transformedData.content,
          keywords: transformedData.keywords,
          url: article.url,
          source: article.source,
          publishedAt: article.publishedAt,
          originalTitle: article.title,
          originalDescription: article.description,
        });

        await newNews.save();
        console.log(`Saved original article with keywords: ${transformedData.title}`);
      } catch (groqError) {
        console.error(`Error generating content with Groq for ${article.url}:`, groqError.message);
      }
    }
    console.log("News fetch and transformation process completed.");
  } catch (error) {
    console.error("News fetch and transform error:", error.message);
  }
};

const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 }).limit(10);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news from database", error: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    res.status(200).json(newsItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news item", error: error.message });
  }
};

module.exports = {
  fetchAndTransformNews,
  getNews,
  getNewsById,
};
