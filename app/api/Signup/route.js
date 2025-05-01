import ConnectToDb from "@/lib/mongodb";
import User from "@/models/users_db";
import bcrypt from "bcrypt";

export async function POST(request) {
    const { username, email, password, confirmPassword } = await request.json();

    if (!username || !email || !password || !confirmPassword) {
        return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    if (password !== confirmPassword) {
        return new Response(JSON.stringify({ message: "Passwords do not match." }), { status: 400 });
    }

    try {
        await ConnectToDb();

        const existingUser = await User.findOne({ username });
        const existingUserMail = await User.findOne({ email });

        if (existingUserMail && existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
        }
        if (existingUser) {
            return new Response(JSON.stringify({ message: "Username already exists" }), { status: 400 });
        }
        if (existingUserMail) {
            return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return new Response(JSON.stringify({ message: "User created successfully." }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error." }), { status: 500 });
    }
}
