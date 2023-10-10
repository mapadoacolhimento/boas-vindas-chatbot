import type { NextApiRequest, NextApiResponse } from "next";

export const FIRST_QUESTION = "Qual foi sua percepção ao interagir com a IAna?";
export const SECOND_QUESTION =
  "Em uma escala de 0 a 5, que nota você daria à sua experiência com a IAna? Por favor, use apenas números.";

const MUTATION = `mutation mapa_do_acolhimento_iana_feedback($answers: [mapa_do_acolhimento_iana_feedback_insert_input!]!) {
  insert_mapa_do_acolhimento_iana_feedback(objects: $answers) {
    returning {
      id
      user_id
      answer
      created_at
      question
    }
  }
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { firstAnswer, rating, userId } = req.body;

    if (!firstAnswer || !rating || !userId) {
      throw new Error("Invalid req body");
    }

    const answers = [
      { answer: firstAnswer, question: FIRST_QUESTION, user_id: userId },
      { answer: `${rating}`, question: SECOND_QUESTION, user_id: userId },
    ];
    const graphqlQuery = {
      query: MUTATION,
      variables: {
        answers: answers,
      },
    };

    const graphqlApiRes = await fetch(`${process.env.GRAPHQL_HTTP_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": `${process.env.HASURA_SECRET}`,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const data = await graphqlApiRes.json();

    if (data && data.errors && data.errors.lenght > 0) {
      throw new Error(JSON.stringify(data.errors));
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send(
        `Something went wrong when saving the feedback answer: ${JSON.stringify(
          e
        )}`
      );
  }
}
