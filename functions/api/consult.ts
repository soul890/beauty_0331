interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { photo, height, weight } = await context.request.json<{
    photo: string;
    height: string;
    weight: string;
  }>();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${context.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "당신은 전문 퍼스널 스타일리스트입니다. 사용자의 사진과 체형 정보를 분석하여 한국어로 스타일 컨설팅 보고서를 작성해주세요. 체형 분석, 어울리는 색상, 추천 스타일, 피해야 할 스타일을 포함해주세요.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: photo },
            },
            {
              type: "text",
              text: `키: ${height}cm, 몸무게: ${weight}kg 입니다. 스타일 컨설팅을 해주세요.`,
            },
          ],
        },
      ],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(JSON.stringify({ error }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const report = data.choices[0]?.message?.content ?? "";

  return new Response(JSON.stringify({ report }), {
    headers: { "Content-Type": "application/json" },
  });
};
