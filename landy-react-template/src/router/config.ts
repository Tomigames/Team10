const routes = [
  {
    path: "/",
    exact: true,
    component: "LoginPage", // default route is login
  },
  {
    path: "/mainhome",
    exact: true,
    component: "Home", // Home now lives at /mainhome
  },
  {
    path: "/calculator",
    exact: true,
    component: "CourseGrades",
  },
  {
    path: "/profile",
    exact: true,
    component: "ProfileForm",
  },
  {
    path: "/notifs",
    exact: true,
    component: "NotifApp",
  },
  {
    path: "/transcript",
    component: "TranscriptDownloader",
  },
  {
    path: "/edit-profile",
    exact: true,
    component: "ProfileEdit",
  },
  {
    path: "/courses",
    exact: true,
    component: "CourseApp",
  },
  {
    path: "/login", // optional: you can also access it here
    exact: true,
    component: "LoginPage",
  },
  {
    path: "/home",
    exact: true,
    component: "Course",
  },
  {
    path: "/edit/:id",
    exact: true,
    component: "EditCourse",
  },
  {
    path: "/create",
    exact: true,
    component: "CreateCourse",
  },
];

export default routes;
