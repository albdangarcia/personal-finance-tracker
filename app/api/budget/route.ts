import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

// You can read the FormData using the request.formData() function:
// export async function POST(request: Request) {
//   const formData = await request.formData()
//   const name = formData.get('name')
//   const email = formData.get('email')
//   return Response.json({ name, email })
// }

export async function GET(resquest: NextRequest) {
  const { searchParams } = new URL(resquest.url);
  const id = searchParams.get('id');
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: id,
      },
    });

    return Response.json({ budgets });
  } catch (error) {
    console.error('Failed to fetch Budgets:', error);
    return Response.json({ message: 'Database Error: Failed to Fetch Budgets.' });
  }
}


// export async function GET() {
//   try {
//     const budgets = await prisma.budget.findMany({
//       where: {
//         userId: "clziqqbgy000108l7dmts0vng",
//       },
//     });

//     return Response.json({ budgets });
//   } catch (error) {
//     console.error('Failed to fetch Budgets:', error);
//     return Response.json({ message: 'Database Error: Failed to Fetch Budgets.' });
//   }
// }


// example to fetch data from external API (Proxying an External API)
// export async function GET() {
//   const res = await fetch('https://data.mongodb-api.com/...', {
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.DATA_API_KEY,
//     },
//   });
//   const data = await res.json();

//   return Response.json({ data });
// }

// POST is used to submit data to be processed to a specified resource.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.frequency || !body.allocation) {
      return NextResponse.json({ message: 'Please provide Frequency and Allocation.' });
    }
    const newBudget = await prisma.budget.create({
      data: {
        frequency: body.frequency,
        allocation: parseFloat(body.allocation),
        userId: "clziqqbgy000108l7dmts0vng",
      },
    });

    return NextResponse.json({ message: 'Budget created successfully', budget: newBudget });
  } catch (error) {
    console.error('Failed to create Budget:', error);
    return NextResponse.json({ message: 'Database Error: Failed to Create Budget.' });
  }
}

// PUT is typically used to update a resource completely.
// export async function PUT(request: Request) {
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ updatedBudget });
  } catch (error) {
    console.error('Failed to update Budget:', error);
    return Response.json({ message: 'Database Error: Failed to Update Budget.' });
  }
}

// PATCH is used to apply partial updates to a resource.
export async function PATCH(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ updatedBudget });
  } catch (error) {
    console.error('Failed to update Budget:', error);
    return Response.json({ message: 'Database Error: Failed to Update Budget.' });
  }
}

// DELETE is used to delete a resource.
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.budget.delete({
      where: { id },
    });

    return Response.json({ message: 'Budget deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete Budget:', error);
    return Response.json({ message: 'Database Error: Failed to Delete Budget.' });
  }
}