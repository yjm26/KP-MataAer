import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

function AppLoginForm({ form, onSubmit }) {
  return (
    <div>
      <div className="flex-col ">
        <h2 className="text-[26px] font-bold mb-4">Hello Again!</h2>
        <p className=" mb-6">Welcome Back</p>
      </div>
      <div className="flex flex-col w-[332px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <p className="text-sm text-gray-500 mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot Password
          </a>
        </p>
      </div>
    </div>
  );
}

export default AppLoginForm;