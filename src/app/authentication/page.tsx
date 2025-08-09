import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const Authentication = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="sign-in">
        <TabsList>
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-sign-in-email">Email</Label>
                <Input id="tabs-sign-in-email" placeholder="johndoe@email.com" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-sign-in-password">Password</Label>
                <Input id="tabs-sign-in-password" placeholder="*******" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Sign In</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Create a new account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-sign-up-email">Email</Label>
                <Input id="tabs-sign-up-email" type="text" placeholder="johndoe@email.com" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-sign-up-name">Name</Label>
                <Input id="tabs-sign-up-name" type="text" placeholder="John Doe" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-sign-up">Password</Label>
                <Input id="tabs-sign-up" type="password" placeholder="*******" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Authentication;