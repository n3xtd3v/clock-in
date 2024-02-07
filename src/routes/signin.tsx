import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "sonner";
import { postDataAPI } from "@/lib/fetchData";
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/auth/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "The Password field is required!",
  }),
  password: z.string().min(1, {
    message: "The Password field is required!",
  }),
});

export default function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  }, [access_token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await postDataAPI("auth/signin-ldap", values, "");

      const {
        status,
        message,
        access_token,
        user: { id, username, ...rest },
      } = res.data;

      if (status === "ok") {
        dispatch(signIn({ user: { id, username, ...rest }, access_token }));

        localStorage.setItem("firstLogin", "true");

        toast("Success.", {
          description: `${message}`,
        });

        navigate("/");
      }
    } catch (error) {
      toast("Error", {
        description: `${error.response.data.message}`,
      });
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Authentication uses the same system as orion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {!form.formState.isSubmitting ? (
                <span>Sign in</span>
              ) : (
                <span className="flex items-center gap-4">
                  <ImSpinner2 className="animate-spin" />
                  <p>Loading...</p>
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        If you encounter any problems, please reach out to an administrator
        phone number 31515.
      </CardFooter>
    </Card>
  );
}
