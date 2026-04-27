import os
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langgraph.prebuilt import create_react_agent

load_dotenv()

# 1. Connect to our local SQLite database
db = SQLDatabase.from_uri(os.getenv("DATABASE_URL"))

# 2. Initialize the OpenAI language model
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# 3. Create the SQL Toolkit and extract its tools 
# (These tools let the graph query the DB schema, run SQL, and catch errors)
toolkit = SQLDatabaseToolkit(db=db, llm=llm)
tools = toolkit.get_tools()

# 4. Define the System Prompt
system_prompt = """
You are an AI Financial Advisor for this user's QuickBooks dashboard.
Always look at the 'transactions' table to answer their questions.
If they ask about their total balance, calculate income minus expenses.
"""
        
        
        
# 4. Compile the LangGraph Agent (Remove the state_modifier argument here!)
graph_agent = create_react_agent(llm, tools)

def ask_financial_assistant(user_query: str) -> str:
    try:
        # 5. Define the System Prompt directly inside the function
        prompt = f"""
        You are an AI Financial Advisor for this user's QuickBooks dashboard.
        Always look at the 'transactions' table to answer their questions.
        If they ask about their total balance, calculate income minus expenses.
        
        User Question: {user_query}
        """
        
        # Pass the combined prompt as the initial state
        inputs = {"messages": [("user", prompt)]}
        
        # Invoke the graph to run through its nodes
        final_state = graph_agent.invoke(inputs)
        
        # The final state returns a list of all messages. We want the very last one.
        return final_state["messages"][-1].content
    except Exception as e:
        return f"I ran into an issue retrieving that data: {str(e)}"

