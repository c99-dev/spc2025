from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from dotenv import load_dotenv

from langchain_core.runnables import RunnableLambda

load_dotenv()

template = "다음 문장을 한국어로 번역해줘:\n\n{sentence}"
prompt = PromptTemplate(
    input_variables=["sentence"],
    template=template,
)
llm = OpenAI(temperature=0.5, max_tokens=1200)

chain = prompt | llm | RunnableLambda(lambda x: {"translation": x.strip()})

result = chain.invoke(
    {
        "sentence": """
                       The old wooden chair creaked. Astronomer Jian had kept the same spot for decades. As the dome-shaped ceiling opened, a night sky as soft as velvet filled his small observatory. Familiar stars were scattered like jewels, but his gaze always ventured beyond, towards the unknown abyss.

In his youth, he first heard of the 'Blue Tear Nebula' from his mentor. Finding this nebula, whose existence was only faintly hinted at in old records, without a single photograph to guide him, became his life's ambition. He had spent countless sleepless nights, the scent of coffee a constant companion, but the nebula remained elusive. Colleagues abandoned the search one by one; some even derided him as a dreamer. Yet, Jian could not stop. For him, it was more than mere astronomical observation; it was an earnest, private dialogue with the cosmos.

The atmosphere was unusually stable tonight. Jian adjusted the telescope out of habit, collecting data from the cooled CCD camera. Expecting anything from the tedious stream of numbers had by now become akin to resignation. Then, it happened. In a corner of the monitor, a minuscule yet distinct spectrum of blue wavelength data caught his eye. His heart pounded fiercely. His fingers trembled. With a slowness and care that belied decades of repeated motion, he fine-tuned the coordinates. He set a long exposure and held his breath.

Slowly, very slowly, an image began to materialize on the monitor. Ah, that was it…! Faint, but unmistakable. A deep, brilliant blue light, like a giant teardrop, shimmered mysteriously in a corner of the universe. It was far deeper, far more sorrowfully beautiful than the imagined image he had painted in his mind from old records. Warmth welled up in Jian's dry eyes. Decades of waiting, frustration, and faint hope flashed before him like a panorama.

He murmured softly, "Finally… we meet." A human, a mere speck in the vast cosmos. Yet, Jian felt with his entire being that the aspirations held by such a small existence could be as deep and wide as the universe itself. The Blue Tear Nebula, as if responding to his long vigil, was etching a piece of eternity onto his retinas. The night deepened, but Jian's universe was shining more brilliantly than ever before."""
    }
)

print("번역결과: ", result["translation"])
