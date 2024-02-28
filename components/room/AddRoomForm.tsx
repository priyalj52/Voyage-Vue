"use client";
import React, { useEffect, useState } from "react";
import { Hotel, Room } from "@prisma/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { UploadButton } from "../ui/uploadthing";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import axios from "axios";
import { Button } from "../ui/button";
import { Loader2, Pencil, PencilLine, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogOpen: () => void;
}
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be atleast 3 char long",
  }),
  desc: z.string().min(10, {
    message: "Desc must be atleast 10 char long",
  }),
  bedCount: z.coerce.number().min(1, { message: "Bed count is req" }),
  guestCount: z.coerce.number().min(1, { message: "guest count is req" }),
  bathRoomCount: z.coerce.number().min(1, { message: "bathroom count is req" }),
  kingBed: z.coerce.number().min(0),
  QueenBed: z.coerce.number().min(0),
  img: z.string().min(1, {
    message: "Img req",
  }),
  breakfastPrice: z.coerce.number().optional(),
  roomCost: z.coerce.number().min(1, { message: "Room price is req" }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

const AddRoomForm = ({ hotel, room, handleDialogOpen }: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.img);
  const [isImgDeleting, setIsImgDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      desc: "",
      bedCount: 0,
      guestCount: 0,
      bathRoomCount: 0,
      kingBed: 0,
      QueenBed: 0,
      img: "",
      breakfastPrice: 0,
      roomCost: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      forestView: false,
      oceanView: false,
      mountainView: false,
      airCondition: false,

      soundProofed: false,
    },
  });

  const { toast } = useToast();
  const router = useRouter()

  function handleImageDelete(image: string) {
    setIsImgDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    // console.log(imageKey,"img key")
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.status === 200) {
          setImage("");
          // console.log("sucessssssssssss")
          toast({
            variant: "default",
            title: "Image removed",
          });
        }
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Something went wrong" });
      })
      .finally(() => {
        setIsImgDeleting(false);
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    setIsLoading(true)
    if (hotel && room) {
      //update
      axios.patch(`/api/room/${room?.id}`, values).then((res) => {
        toast({ variant: 'default', title: `Room updated!` });
        router.refresh()
        setIsLoading(false)
        handleDialogOpen()
      }).catch((err) => {
        console.error(err)
        toast({ variant: 'destructive', title: `Something went wrong!` });
        setIsLoading(false)

      })

    } else {
      if (!hotel)
        return;

      axios.post("/api/room", { ...values, hotelId: hotel?.id }).then((res) => {
        toast({ variant: 'default', title: `Room created sucessfully!` });
        router.refresh()
    
        setIsLoading(false)
        handleDialogOpen()
      }).catch((err) => {
        console.error(err,"error at room")
        toast({ variant: 'destructive', title: `Something went wrong!` });
        setIsLoading(false)

      })
    }
  }
  useEffect(() => {
    if (typeof image === 'string')
      form.setValue('img', image, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true
      })
  }, [image])
  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormDescription>Provide a room name</FormDescription>

                <FormControl>
                  <Input placeholder="Room" {...field} />
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
                <FormLabel>Room Description</FormLabel>
                <FormDescription>Describe your Room</FormDescription>

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
          <div>
            <FormLabel>Choose your Room Amenities</FormLabel>
            <FormDescription>
              what makes this room a good choice
            </FormDescription>

            <div className="grid grid-cols-2 gap-2 mt-2 ">
              <FormField
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>24X7 room service</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TV"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>TV</FormLabel>
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
                    <FormLabel>free wifi</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Balcony</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityView"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>city view</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>forest view</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Air conditioned</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>ocean view</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>mountain view</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem className="flex  items-end space-x-3 rounded-md border p-4  flex-row">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>sound proofed</FormLabel>
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
                      {image ? (
                        <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-3 ">
                            <Image
                              fill
                              src={image}
                              alt="hotel-image"
                              className="object-contain"
                            />
                            <Button
                              onClick={() => handleImageDelete(image)}
                              type="button"
                              className="absolute right-[-2rem] top-0 "
                              size={"icon"}
                              variant={"ghost"}
                            >
                              {isImgDeleting ? <Loader2 /> : <XCircle />}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col max-w-[4000px] items-center p-12 border border-dashed border-primary/50 rounded mt-4">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                console.log("Files: ", res);
                                setImage(res[0].url);
                                toast({
                                  variant: "default",
                                  title: `Image uploaded successfully!`,
                                });
                              }}
                              onUploadError={(error: Error) => {
                                console.log(error);
                                toast({
                                  variant: "destructive",
                                  title: `ERROR! ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row justify-center gap-6">
              <div className="flex-1 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="roomCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price</FormLabel>
                      <FormDescription>
                        State the price for staying in this room for 24hrs
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>bed Count</FormLabel>
                      <FormDescription>
                        How many beds are avilable
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} max={8} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest count</FormLabel>
                      <FormDescription>
                        How many Guests are allowed
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} max={20} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathRoomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>bathroom count</FormLabel>
                      <FormDescription>
                        How many bathrooms are in this room
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} max={20} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="breakfastPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>breakfast price</FormLabel>
                      <FormDescription>Enter Price in rupees</FormDescription>

                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kingBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>king beds</FormLabel>
                      <FormDescription>
                        How many king beds are available in tis room
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} max={8} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="QueenBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Queen Bed</FormLabel>
                      <FormDescription>
                        How many queen beds are in this room
                      </FormDescription>

                      <FormControl>
                        <Input type="number" min={0} max={8} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

               
              </div>
            </div>

            <div className="pt-4 pb-2">
              {/* {hotel && <Button className="max-w-[150px]" variant="ghost" onClick={() => handleDleteHotel(hotel)}>{iseHotelDeleting ? <><Loader2 className="mr-2 w-4 h-4" /> Deleting</> : <><Trash className="mr-2 w-4 h-4" /> Delete </>}</Button>} */}

              {room ? (
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="max-w-[150px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4" />
                      Updating
                    </>
                  ) : (
                    <>
                      <PencilLine className="mr-2 w-4 h-4" />
                      Update
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={form.handleSubmit(onSubmit)} className="max-w-[150px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4" />
                      Creating
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 w-4 h-4" />
                      Create Room
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
