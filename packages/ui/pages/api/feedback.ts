import type { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from './db';

export const FIRST_QUESTION =
  'Qual foi sua percepção ao interagir com a IAna?';
export const SECOND_QUESTION =
  'Em uma escala de 0 a 5, que nota você daria à sua experiência com a IAna? Por favor, use apenas números.';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { firstAnswer, rating, userId } = req.body;

    if (!firstAnswer || !rating || !userId) {
      throw new Error('Invalid req body');
    }

    const answers = [
      {
        answer: firstAnswer,
        question: FIRST_QUESTION,
        user_id: Number(userId),
      },
      {
        answer: `${rating}`,
        question: SECOND_QUESTION,
        user_id: Number(userId),
      },
    ];
   
    const iana_feedbacks = await prisma.iana_feedback.createMany( {
      data : answers
      
    }); 

    return res.status(200).json(iana_feedbacks);
  } catch (e: any) {
    console.error(e);
    return res
      .status(500)
      .send(
        `Something went wrong when saving the feedback answer: ${e.message}`
      );
  }
}
