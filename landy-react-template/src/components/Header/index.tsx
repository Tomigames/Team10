// import { useState, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { UserContext } from "../../pages/UserContext";
// import { Row, Col, Drawer } from "antd";
// import { withTranslation, TFunction } from "react-i18next";
// import Container from "../../common/Container";
// import { SvgIcon } from "../../common/SvgIcon";
// import { Button } from "../../common/Button";
// import {
//   HeaderSection,
//   LogoContainer,
//   Burger,
//   NotHidden,
//   Menu,
//   CustomNavLinkSmall,
//   Label,
//   Outline,
//   Span,
// } from "./styles";

// const Header = ({ t }: { t: TFunction }) => {
//   const [visible, setVisibility] = useState(false);
//   const nav = useNavigate();
//   const location = useLocation();
//   const { userId } = useContext(UserContext) as any;

//   // Hide header if user is not logged in OR current route is /login
//   if (!userId || location.pathname === "/login") {
//     return null;
//   }

//   const toggleButton = () => {
//     setVisibility(!visible);
//   };

//   const handleWhatIfCalculatorClick = () => {
//     nav("/calculator");
//     setVisibility(false);
//   };

//   const handleUserProfileClick = () => {
//     nav("/profile");
//     setVisibility(false);
//   };

//   const handleUserNotifsClick = () => {
//     nav("/notifs");
//     setVisibility(false);
//   };

//   const handleCoursesClick = () => {
//     nav("/courses");
//     setVisibility(false);
//   };

//   // Add handler for transcript navigation
//   const handleTranscriptClick = () => {
//     nav("/transcript");
//     setVisibility(false);
//   };

//   const MenuItem = () => {
//     const linkStyle = {
//       fontSize: "16px",
//       padding: "4px 8px",
//       margin: "0 4px",
//       display: "inline-block"
//     };
  
//     const spanStyle = {
//       fontSize: "19px"
//     };
//     const scrollTo = (id: string) => {
//       const element = document.getElementById(id) as HTMLDivElement;
//       element.scrollIntoView({ behavior: "smooth" });
//       setVisibility(false);
//     };
//     return (
//       <>
//         <CustomNavLinkSmall onClick={handleCoursesClick} style={linkStyle}>
//         <Span style={spanStyle}>{t("Courses and Grades")}</Span>
//       </CustomNavLinkSmall>
//       <CustomNavLinkSmall onClick={handleWhatIfCalculatorClick} style={linkStyle}>
//         <Span style={spanStyle}>{t("What-If Calculator")}</Span>
//       </CustomNavLinkSmall>

//       <CustomNavLinkSmall onClick={handleUserNotifsClick} style={linkStyle}>
//         <Span style={spanStyle}>{t("Notifications")}</Span>
//       </CustomNavLinkSmall>
//       <CustomNavLinkSmall onClick={handleUserProfileClick} style={linkStyle}>
//         <Span style={spanStyle}>{t("User Profile")}</Span>
//       </CustomNavLinkSmall>
//       <CustomNavLinkSmall onClick={handleTranscriptClick} style={linkStyle}>
//         <Span style={spanStyle}>{t("Transcript")}</Span>
//       </CustomNavLinkSmall>
//       <CustomNavLinkSmall style={{ width: "180px" }} onClick={() => nav("/login")}>
//           <Span>
//             <Button color="rgb(200, 100, 57)">{t("Log Out")}</Button>
//           </Span>
//         </CustomNavLinkSmall>
 
//       </>
//     );
//   };

//   return (
//     <HeaderSection>
//       <Container>
//         <Row justify="space-between">
//           <LogoContainer to="/mainhome" aria-label="homepage">
//             <SvgIcon src="logo.png" width="101px" height="64px" />
//           </LogoContainer>
//           <NotHidden>
//             <MenuItem />
//           </NotHidden>
//           <Burger onClick={toggleButton}>
//             <Outline />
//           </Burger>
//         </Row>
//         <Drawer closable={false} open={visible} onClose={toggleButton}>
//           <Col style={{ marginBottom: "2.5rem" }}>
//             <Label onClick={toggleButton}>
//               <Col span={12}>
//                 <Menu>Menu</Menu>
//               </Col>
//               <Col span={12}>
//                 <Outline />
//               </Col>
//             </Label>
//           </Col>
//           <MenuItem />
//         </Drawer>
//       </Container>
//     </HeaderSection>
//   );
// };

// export default withTranslation()(Header);


import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../pages/UserContext";
import { Row, Col, Drawer } from "antd";
import { withTranslation, TFunction } from "react-i18next";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";

const Header = ({ t }: { t: TFunction }) => {
  const [visible, setVisibility] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const { userId } = useContext(UserContext) as any;

  // Hide header if user is not logged in OR current route is /login
  if (!userId || location.pathname === "/login") {
    return null;
  }

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const handleWhatIfCalculatorClick = () => {
    nav("/calculator");
    setVisibility(false);
  };

  const handleUserProfileClick = () => {
    nav("/profile");
    setVisibility(false);
  };

  const handleUserNotifsClick = () => {
    nav("/notifs");
    setVisibility(false);
  };

  const handleCoursesClick = () => {
    nav("/courses");
    setVisibility(false);
  };

  // Add handler for transcript navigation
  const handleTranscriptClick = () => {
    nav("/transcript");
    setVisibility(false);
  };

  const handleLogout = () => {
    //nav("/login");
    window.location.reload(); // Trigger a page refresh
  };

  const MenuItem = () => {
    const linkStyle = {
      fontSize: "16px",
      padding: "4px 8px",
      margin: "0 4px",
      display: "inline-block"
    };

    const spanStyle = {
      fontSize: "19px"
    };
    const scrollTo = (id: string) => {
      const element = document.getElementById(id) as HTMLDivElement;
      element.scrollIntoView({ behavior: "smooth" });
      setVisibility(false);
    };
    return (
      <>
        <CustomNavLinkSmall onClick={handleCoursesClick} style={linkStyle}>
        <Span style={spanStyle}>{t("Courses and Grades")}</Span>
      </CustomNavLinkSmall>
      <CustomNavLinkSmall onClick={handleWhatIfCalculatorClick} style={linkStyle}>
        <Span style={spanStyle}>{t("What-If Calculator")}</Span>
      </CustomNavLinkSmall>

      <CustomNavLinkSmall onClick={handleUserNotifsClick} style={linkStyle}>
        <Span style={spanStyle}>{t("Notifications")}</Span>
      </CustomNavLinkSmall>
      <CustomNavLinkSmall onClick={handleUserProfileClick} style={linkStyle}>
        <Span style={spanStyle}>{t("User Profile")}</Span>
      </CustomNavLinkSmall>
      <CustomNavLinkSmall onClick={handleTranscriptClick} style={linkStyle}>
        <Span style={spanStyle}>{t("Transcript")}</Span>
      </CustomNavLinkSmall>
      <CustomNavLinkSmall style={{ width: "180px" }} onClick={handleLogout}>
          <Span>
            <Button color="rgb(200, 100, 57)">{t("Log Out")}</Button>
          </Span>
        </CustomNavLinkSmall>

      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/mainhome" aria-label="homepage">
            <SvgIcon src="logo.png" width="101px" height="64px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={toggleButton}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={toggleButton}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={toggleButton}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
 