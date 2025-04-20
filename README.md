At this point, I think this right here - yes, the 'GradeView_SampleProject' - is the best thing we got.

Design-wise, it's not anything particularly special, but I did basically have it setup such that we can play around with the design while it won't mess with our core logic.

So yeah, at this point, if you have your code for your own use cases completed, then feel free to merge them here (if you know how it all should be linked together, then great! if not, then feel free to plug in the whole thing into genAI and go from there)

If you want to see how it works so far...

**commands:**
`cd backend`
`npm install`
`npm run dev`

`cd frontend`
`npm install`
`npm start`


*if you don't want to run those commands, then basically I have it setup such that there's a basic-looking homepage, followed by the login or signup page, which, if the system worked properly, would lead to the courses page and then my first use case of editing grade weights manually (which doesn't look great but I'm pretty sure that it works, tho I haven't tested it much yet).*



Now, as far as things we have to get done...

- modify the database in order to have the 'users' table account for the passwords (which will be encrypted via bcrypt)
- use that to finish up the login and sign-up which I managed to get us started on
- well, besides those two there's everything else...


***but hey, we got this!***
remember that.