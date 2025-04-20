from openai import OpenAI
from api.open_ai.rag.rag import query

client = OpenAI()

class OpenAiService:
    @staticmethod
    def create_response(prompt: str) -> str:
        try:
            answer, sources = query(prompt, model_name="gpt-4o", verbose=False)
            if answer.lower().startswith("error"):
                raise Exception("Detected error in RAG response")
            return answer
        except Exception as e:
            print(f"RAG pipeline failed with error: {e}. Falling back to vanilla OpenAI API.")
            response = client.responses.create(
                model="gpt-4o",
                input=prompt,
            )
            return response.output_text

if __name__ == "__main__":
    prompt = "Show me the code for calling the vision API"
    result = OpenAiService.create_response(prompt)
    print(result)