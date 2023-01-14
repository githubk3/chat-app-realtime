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
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { authService } from "../../services/auth.service";

export function LoginAuth() {
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
            const res = await authService.login(values);
            console.log(res);
            showNotification({
                message: "You login successfully!",
                color: "yellow",
                icon: <IconCheck />,
                autoClose: 3000,
            });
            form.reset();
        } catch (error: any) {
            showNotification({
                title: "Login failure!",
                message: error.response.data.message,
                color: "red",
                icon: <IconX />,
                autoClose: 3000,
            });
        }
    };

    return (
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
                <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        required
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        {...form.getInputProps("password")}
                    />
                    <Group position="apart" mt="lg">
                        <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
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
    );
}
