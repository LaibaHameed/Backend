//? 1. Create Account  
// ye method post ho ga kiu k hm db mai cheezain post kr ry hain(db mai data enter kr ry hain)
// sb se phly user ki req k sath jo jo data aya hai os ko destructure kr lain gy
// yani form mai jo jo submit kia wo
// phir hm userModel(user table) mai se find karin gy k is email se ohly toh koi account register nahi hai?
// agr how toh hm return kr dain gy 
if (user) return res.status(400).send("User already exists");
// agr koi account na register howa toh hm os k password ko sbb se phly has mai convert karin gy
// phir user create karin gy (like table mai user ki entery karin gy)
// phir hm token set kain gy for cookie, toh os k liye unique cheezy chahiye hoti hai toh hm email or userid jwt mai bejain gy jo cookie mai store ho jaye ga
let token = jwt.sign({ email: email, userid: createdUser._id }, "secretkey");
res.cookie('token', token);
// phir hm user ko kahin gy login karo.

//? 2. login account
// ye b method post ho ga.
// user ki req k sath jo cheezain aye gi , on ko destruct kr lain gy
// phir hm userModel mai se(user table mai se email ki base py account find out karin gy)
// agr email na match hoi toh account register nahi hai req ko return kr dain gy
// agr email match ho gae toh , yani email se account mil gya , toh phir hm password match karaye gy,
// lekin hm ne toh password hash mai store kia tha toh bcrypt ik method deta hai
bcrypt.compare(password, user.password);
// ik cheez yad rkhni hai jb b hm koi cheez find kr ry hon gy toh , time lgta hai, but js waits for none, so we always make functions async await.
// agr password match na howa toh return
// else hm jwt as cookie send krin gy or redirect kara dain gy user profile py

//? 3. logout
// logout is simple , you have to do only one thing which is, empty cookies, set cookie token = " "
res.cookie("token", "");
// and redirect to login page

//? 4. profile
// if someone want to access profile, he can but on condition that he had must logged in.
// so for this we check is he logged in or not?
//*middleWare
// so for this , here is the entry of middleware in the scene
// middleware defination is simple: u want to perform a action like:
// u want to go from home page to profile page, before giving access to user for profile page, we perform some sort of tasks , and these tasks are called middlewares. 
// so that's the story now move to real one.

// we make isLoggedIn middleware. middleware is just a fancy term , it nothing as sacary as it looks like , its just a function,

// in isLoggedIn function we take token(we read token) and if token is empty user is not loggedIn.
// if token is not empty we verify it by secretkey, if its verify its gives us the decoded data , which we send it in jwt like email, userid ets
// if its not verify it will throw an error
const data = jwt.verify(token, "secretkey");
// hm logo ne ik user object add kr dia or os ko data assign kia jo jwt ko decode ho k aya tha
// When the token is created, the payload might look like this
// {
//     "email": "user@example.com",
//     "userid": "1234567890abcdef"
// }
// After verifying the token, this payload is assigned to req.user, so req.user will be:
req.user = {
    email: "user@example.com",
    userid: "1234567890abcdef"
};
req.user = data;
// ab jb se wo logged in hai oski req k sath ye user chipka hi ry ga , unless hm logout na kar jain
next();
// next() means it will handled by next handler(some sort of function);
// phir hm userModels mai se email k bases py user find karin gy or oska posts wala array populate kr dain gy
// or phir profile page py user ko render kara dain gy

//? 5. post creation
// sb se phly hm verify karin gy user logged in hai,
// agr hai toh phir req k sath user object aye ga jis mai payload/jwt ka decoded data ho ga,
// ab os req.user.email ki bases py hm user find out karin gy or content b destruct kr lain gy
// phir hm (user ki tarha) post create karin gy (post table mai entry karin gy) or user field ko hm as a forign key ki tarha treat kari gy. post table mai user: user._id,
// phir hm created post ki id ko user table mai posts wali fielf(jo k ik array type) hai mai push karin gy
// or ye sb hm ne user table mai koch changes perform kiye hain toh user.save(); kr lain gy
// or user ko profile py redirect kara dain gy
// or profile page py ja k( user toh already send kia tha jb os ko profile li access di thi), user.posts.forEach lga k sb post ko acquire kr lain gy

//? like the post
//? eidt the post
//? delete the post

//* req.params is used to access route parameters in the URL.
// For example, in the like function, the route is defined as /like/:id. The :id part is a route parameter, and you can access its value using req.params.id.
// This is useful when you need to perform actions on a specific resource identified by an ID in the URL.

//* req.user is used to access the authenticated user's information.
// This information is typically set by authentication middleware (in your case, isLoggedIn) after verifying the user's JWT token.
// This is useful when you need to perform actions related to the logged-in user, such as creating a post or adding the user's like to a post.

//*populate:
//  In Mongoose (a MongoDB object modeling tool for Node.js), the populate method is used to replace the specified path(s) in the document with documents from other collections. It is often used for referencing documents in other collections and fetching the related data in one query.

// When you have references to other documents (typically via ObjectIds), you can use populate to automatically replace those references with the actual documents they point to. This is particularly useful for handling relationships between documents, such as one-to-many or many-to-many relationships.

// Example Explanation
// Consider the following example where you have a postModel and a userModel. Each post has a reference(foreign key) to a user who created the post. In this case, postModel(table) contains a field user which is an ObjectId referencing the userModel.

// When you fetch posts and want to include the user information associated with each post, you use populate. This fetches the user document(row) referenced by the user(oreign key) field in each post(row) and includes it in the result.
post.user.username
// post(table) ki ik col hai user os user ka koi username b hai(user table mai) wo ly ao