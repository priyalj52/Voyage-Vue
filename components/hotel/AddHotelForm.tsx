"use client";
import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddRoomForm from "../room/AddRoomForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { UploadButton } from "../ui/uploadthing";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import axios from "axios"
import { Eye, Loader2, Pencil, PencilLine, Plus, Terminal, Trash, Trash2, XCircle } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { ICity, IState, State } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AddHotelFormProps {
  hotel: hotelWithRooms | null;
}
export type hotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title musti be 3 char long",
  }),

  desc: z.string().min(10, {
    message: "Title musti be 10 char long",
  }),

  img: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDesc: z.string().min(10, {
    message: "Location desc must be 10 char long",
  }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundary: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeeShop: z.boolean().optional(),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.img);
  const [isImgDeleting, setIsImgDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open,setOpen]=useState(false)
  const { toast } = useToast();
  const { getAllCountries, getCountryStates, getStateCities } = useLocation()
  const router = useRouter()
  const [iseHotelDeleting, setIsHotelDeleting] = useState(false)
  const countries = getAllCountries()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: "",
      desc: "",
      img: "",
      country: "",
      state: "",
      city: "",
      locationDesc: "",
      gym: false,
      spa: false,
      bar: false,
      laundary: false,
      restaurant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false
    },
  });

  useEffect(() => {
    if (typeof image === 'string')
      form.setValue('img', image, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true
      })
  }, [image])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    setIsLoading(true)
    if (hotel) {
      //update
      axios.patch(`/api/hotel/${hotel?.id}`, values).then((res) => {
        toast({ variant: 'default', title: `hotel updated!` });
        router.push(`/hotel/${res.data.id}`)
        setIsLoading(false)
      }).catch((err) => {
        console.error(err)
        toast({ variant: 'destructive', title: `Something went wrong!` });
        setIsLoading(false)

      })

    } else {
      axios.post("/api/hotel", values).then((res) => {
        toast({ variant: 'default', title: `hotel created sucessfully!` });
        router.push(`/hotel/${res.data.id}`)
        setIsLoading(false)
      }).catch((err) => {
        console.error(err)
        toast({ variant: 'destructive', title: `Something went wrong!` });
        setIsLoading(false)

      })
    }
  }
  function handleImageDelete(image: string) {
    setIsImgDeleting(true)
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    // console.log(imageKey,"img key")
    axios.post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.status === 200) {
          setImage('')
          // console.log("sucessssssssssss")
          toast({
            variant: "default",
            title: "Image removed"
          })
        }
      }).catch(() => {
        toast({ variant: 'destructive', title: 'Something went wrong' })
      }).finally(() => {
        setIsImgDeleting(false)
      })

  }
  useEffect(() => {
    const selectedCntry = form.watch('country')
    const countryStates = getCountryStates(selectedCntry)
    if (countryStates)
      setStates(countryStates)
  }, [form.watch('country')])

  useEffect(() => {
    const selectedCntry = form.watch('country')
    const selectedState = form.watch('state')
    const stateCities = getStateCities(selectedCntry, selectedState)
    if (stateCities)
      setCities(stateCities)
  }, [form.watch('country'), form.watch('state')])

  const handleDleteHotel = async (hotel: hotelWithRooms) => {
    setIsHotelDeleting(true)
    //imgae delete
    const getImageKey = (src: string) =>  src.substring(src.lastIndexOf("/") + 1); 
 
    try {
      const imageKey = getImageKey(hotel?.img)
      // console.log("img key from deltehotel",getImageKey(hotel?.img))
      await axios.post("/api/uploadthing/delete", { imageKey })
      await axios.delete(`/api/hotel/${hotel.id}`)
      setIsHotelDeleting(false)
      toast({
        variant: "default",
        title: "Hotel removed"
      })
      router.push("/hotel/new")
    } catch (err: any) {
      console.log(err)
      setIsHotelDeleting(false)
      toast({ variant: 'destructive', title: 'hotel deletion  failed' })
    }
  }

const handleDialogOpen=()=>{
  setOpen((prev)=>!prev)
}

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h3 className="font-semibold text-lg">
            {hotel ? "Update your Hotel" : "Tell us more about your hotel"}
          </h3>
          <div className="flex flex-col md:flex-row  gap-6">
            <div className="flex-1 flex-col flex gap-6 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormDescription>
                      Provide a name to your Hotel
                    </FormDescription>

                    <FormControl>
                      <Input placeholder="Hotel" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Description</FormLabel>
                    <FormDescription>Describe your Hotel</FormDescription>

                    <FormControl>
                      <Textarea
                        placeholder="Kai Heng Century Hotel offers ultimate comfort and luxury!"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormLabel>Amenities</FormLabel>
              <FormDescription>Choose your Amenities</FormDescription>
              <div className="grid grid-cols-2 gap-4 ">
                <FormField
                  control={form.control}
                  name="gym"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Gym</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="laundary"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Laundary</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bar"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Bar</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spa"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Spa</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="restaurant"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Restaurant </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shopping"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel> Shopping </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="freeParking"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Free Parking </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bikeRental"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel> Bike Rental </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="freeWifi"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Free Wifi </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="movieNights"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Movie Nights </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="swimmingPool"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Swimming Pool </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coffeeShop"
                  render={({ field }) => (
                    <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel> Coffee Shop </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3">
                      <FormLabel>Upload an image</FormLabel>
                      <FormDescription>
                        choose an image for your hotel
                      </FormDescription>
                      <FormControl>
                        {image ? <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-3 ">

                            <Image fill src={image} alt="hotel-image" className="object-contain" />
                            <Button onClick={() => handleImageDelete(image)} type="button" className="absolute right-[-2rem] top-0 " size={'icon'} variant={'ghost'}>{isImgDeleting ? <Loader2 /> : <XCircle />}</Button>
                          </div></> : <>
                          <div className="flex flex-col max-w-[4000px] items-center p-12 border border-dashed border-primary/50 rounded mt-4">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {

                                console.log("Files: ", res);
                                setImage(res[0].url)
                                toast({ variant: 'default', title: `Image uploaded successfully!` });

                              }}
                              onUploadError={(error: Error) => {


                                console.log(error)
                                toast({ variant: "destructive", title: `ERROR! ${error.message}` });
                              }}
                            />
                          </div>
                        </>
                        }
                      </FormControl>

                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex-1 flex-col flex gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>
                      <FormDescription>where is your hotel located</FormDescription>
                      <Select disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => {
                            return <SelectItem key={country.name} value={country.isoCode}>{country.name}</SelectItem>
                          })}


                        </SelectContent>
                      </Select>

                    </FormItem>
                  )} />


                <FormField
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>which State is your hotel located</FormDescription>
                      <Select disabled={isLoading || !!states.length <1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => {
                            return <SelectItem key={state.isoCode} value={state.isoCode}>{state.name}</SelectItem>
                          })}


                        </SelectContent>
                      </Select>

                    </FormItem>
                  )} />





              </div>
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City</FormLabel>
                    <FormDescription>which city is your hotel located</FormDescription>
                    <Select disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue defaultValue={field.value} placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => {
                          return <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                        })}


                      </SelectContent>
                    </Select>

                  </FormItem>
                )} />

              <FormField
                control={form.control}
                name="locationDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description</FormLabel>
                    <FormDescription>Provide detailed location Desciption</FormDescription>

                    <FormControl>
                      <Textarea
                        placeholder="Located near a beach "
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
{hotel && !hotel.rooms.length && 
  <Alert className="bg-blue-500">
  <Terminal className="h-4 w-4" />
  <AlertTitle>One last step</AlertTitle>
  <AlertDescription>
  <div>Please Add rooms to complete your hotel setup</div>
  </AlertDescription>
</Alert>

}

              <div className="flex justify-between gap-3 flex-wrap">
                {hotel && <Button className="max-w-[150px]" variant="ghost" onClick={() => handleDleteHotel(hotel)}>{iseHotelDeleting ? <><Loader2 className="mr-2 w-4 h-4" /> Deleting</> : <><Trash className="mr-2 w-4 h-4" /> Delete </>}</Button>}

                {hotel ? <Button disabled={isLoading} className="max-w-[150px]">{isLoading ? <><Loader2 className="mr-2 w-4 h-4" />Updating</> : <><PencilLine className="mr-2 w-4 h-4" />Update</>}</Button> : <Button>{isLoading ? <><Loader2 className="mr-2 w-4 h-4" />Creating</> : <><Pencil className="mr-2 w-4 h-4" />Create HOtel</>}</Button>}


                <Dialog open onOpenChange={setOpen} >

  <DialogTrigger>
    <Button variant={"outline"} type="button" className="max-w-[150px]">
      <Plus className="mr-2 w-4 h-4"/>
    Add Room
    </Button>
    </DialogTrigger>
  <DialogContent className="max-w-[900px] w-[90%]">
    <DialogHeader className="px-2">
      <DialogTitle>Add a room</DialogTitle>
      <DialogDescription>
       add details about room
      </DialogDescription>
     
    </DialogHeader>
    <AddRoomForm hotel={hotel} handleDialogOpen={handleDialogOpen} />
    
  </DialogContent>
</Dialog>


{hotel && <Button onClick={()=>router.push(`/hotel-details/${hotel.id}`)} className="max-w-[150px]" type="button" variant="outline" ><Eye className="mr-2 w-4 h-4"  />View</Button>}


              </div>


            </div>
          </div>
        </form>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default AddHotelForm;
