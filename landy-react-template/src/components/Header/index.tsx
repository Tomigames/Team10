import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation, TFunction } from "react-i18next";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import { useNavigate } from "react-router-dom";
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

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const handleWhatIfCalculatorClick = () => {
    nav("/calculator"); // Navigate to /calculator route
    setVisibility(false); // Close the menu (if it's open)
  };

  const handleUserProfileClick = () => {
    nav("/profile"); // Navigate to /calculator route
    setVisibility(false); // Close the menu (if it's open)
  };

  const handleUserNotifsClick = () => {
    nav("/notifs"); // Navigate to /calculator route
    setVisibility(false); // Close the menu (if it's open)
  };
  const handleCoursesClick = () => {
    nav("/courses"); // Navigate to /calculator route
    setVisibility(false); // Close the menu (if it's open)
  };

  const MenuItem = () => {
    const scrollTo = (id: string) => {
      const element = document.getElementById(id) as HTMLDivElement;
      element.scrollIntoView({
        behavior: "smooth",
      });
      setVisibility(false);
    };
    return (
      <>
        <CustomNavLinkSmall onClick={handleCoursesClick}>
          <Span>{t("Courses and Grades")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={handleWhatIfCalculatorClick}>
          <Span>{t("What-If Calculator")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("product")}>
          <Span>{t("Transcript")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={handleUserNotifsClick}>
          <Span>{t("Notifications")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall
          style={{ width: "180px" }}
          onClick={handleUserProfileClick}
        >
          <Span>
            <Button color="rgb(200, 100, 57)">{t("User Profile")}</Button>

          </Span>
        </CustomNavLinkSmall>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
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
