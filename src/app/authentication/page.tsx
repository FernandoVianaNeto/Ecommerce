import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import SignInForm from "./components/sign-in-form"
import SignUpForm from "./components/sign-up-form"
import Header from "@/components/common/header"

const Authentication = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex flex-1 items-center justify-center w-full">
        <div className="flex w-full max-w-sm flex-col gap-6 p-5 sm:max-w-md md:max-w-lg">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="sign-in" className="w-1/2">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up" className="w-1/2">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    
  )
}

export default Authentication;