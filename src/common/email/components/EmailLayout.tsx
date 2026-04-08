import {
  Html,
  Head,
  Body,
  Container,
  Img,
  Text,
  Section,
} from "@react-email/components";

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Img
              src="https://res.cloudinary.com/debacodes/image/upload/v1775666603/logo_la6fac.png"
              width="120"
              alt="Plasticonn"
            />
          </Section>

          {/* Content */}
          <Section style={styles.content}>{children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Plasticonn
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f4f4f7",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    maxWidth: "520px",
    margin: "0 auto",
    borderRadius: "10px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#005C3D",
    padding: "20px",
    textAlign: "center" as const,
  },
  content: {
    padding: "30px",
  },
  footer: {
    backgroundColor: "#f4f4f7",
    padding: "15px",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "12px",
    color: "#888",
  },
};
