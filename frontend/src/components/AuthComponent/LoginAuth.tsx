import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    LoadingOverlay,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX, IconAt, IconLock } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { authService } from "../../services/auth.service";
import { AuthContext } from "../../contexts/AuthContext";

export function LoginAuth() {
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthContext);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validateInputOnBlur: true,

        validate: {
            email: isEmail("Invalid email"),
            password: hasLength(
                { min: 8, max: 20 },
                "Value must have 8 or more characters"
            ),
        },
    });

    const navigate = useNavigate();

    const handleError = (errors: typeof form.errors): void => {
        if (errors.password) {
            showNotification({
                message: "Pass word incorrect",
                color: "red",
            });
        } else if (errors.email) {
            showNotification({
                message: "Please provide a valid email",
                color: "red",
            });
        }
    };

    const handleSubmit = (values: typeof form.values): void => {
        handleValidate(values);
    };

    const handleValidate = async (values: typeof form.values) => {
        try {
            setLoading(true);
            await authService.login(values);
            setLoading(false);
            showNotification({
                message: "You login successfully!",
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });
            const response = await authService.getProfile();
            setUser(response.data);
            navigate("/chat");
            form.reset();
        } catch (error: any) {
            showNotification({
                title: "Login failure!",
                message: error.response.data.message,
                color: "red",
                icon: <IconX />,
                autoClose: 3000,
            });
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingOverlay
                visible={loading}
                overlayBlur={0.1}
                transitionDuration={200}
            />
            <Center>
                <Container size={420} my={40}>
                    <Title
                        align="center"
                        sx={(theme) => ({
                            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                            fontWeight: 900,
                        })}
                    >
                        Welcome to IChat!
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Do not have an account yet?{" "}
                        <Anchor<"a"> href="/auth/register" size="sm">
                            Create account
                        </Anchor>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(handleSubmit, handleError)}
                        >
                            <TextInput
                                label="Email"
                                placeholder="you@mantine.dev"
                                icon={<IconAt size={16} />}
                                required
                                {...form.getInputProps("email")}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                icon={<IconLock size={16} />}
                                required
                                mt="md"
                                {...form.getInputProps("password")}
                            />
                            <Group position="apart" mt="lg">
                                <Checkbox
                                    label="Remember me"
                                    sx={{ lineHeight: 1 }}
                                />
                                <Anchor<"a">
                                    onClick={(event) => event.preventDefault()}
                                    href="#"
                                    size="sm"
                                >
                                    Forgot password?
                                </Anchor>
                            </Group>
                            <Button fullWidth mt="xl" type="submit">
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Center>
        </>
    );
}
