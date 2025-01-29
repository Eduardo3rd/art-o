'''
look at this 
June 2021
Eduardo Torrealba
'''

#cairo is the primary drawing library used to create images
import cairocffi as cairo
import math
import numpy as np
import random
import os
import datetime
import time
import ardo 


#this is the funtion that draws the images
def images(num_images):

	for value in range(num_images):
		#start of canvas prep
		
		#image size in pixels
		w = 3000
		h = 3000
		
		# create the canvas 
		surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, w, h)
		dc = cairo.Context(surface) 
		
		# set background color 
		dc.set_source_rgb(ardo.color['black'][0],ardo.color['black'][1],ardo.color['black'][2])

		dc.paint()

		#end of canvas prep
		
		#ardo.circle(dc, w/2, h/2, w/4)
		
		#start of drawing 
		
		
		works = True 
		print('selecting grid size...')
		
		while works:
			grid_size = random.randint(20,1500)
			if w % grid_size:
				works = True 
			else: 
				works = False  
		
		print("grid size is")
		print(grid_size)
		
		cells  = int(w/grid_size)
		
		print("number of cells is")
		print(cells)
		
		P = []
		P_edit = []
		
		
		print("making grid...")
		
		for i in range(0, cells+1):
			for j in range(0, cells+1):
				P.append((i*grid_size,j*grid_size))
		
		
		print("grid complete")
		#print(P)

		print("drawing circles...")
		
		for pair in P:
			chance = random.random()
			if chance > 0.25:
				weight = random.randint(1,10)
				raidus = random.randint(10,20)
				ardo.circle(dc, pair[0], pair[1], raidus, weight,'white')
				#ardo.hexagon(dc,raidus, pair[0], pair[1],weight)
				P_edit.append((pair[0],pair[1]))
				dc.move_to(pair[0],pair[1])
			else:
				do = 1


		print("circles complete")
		
		print("drawing lines...")
		
		length = len(P_edit)
		for w in range(length):
			pair = random.choice(P_edit)
			dc.line_to(pair[0],pair[1])


		dc.set_source_rgb(ardo.RGBconv(256),ardo.RGBconv(256),ardo.RGBconv(256))
		dc.set_line_width(2)
		dc.stroke()
		
		ardo.circle(dc, random.randint(1000,3000), random.randint(1000,3000), random.randint(100,500), random.randint(20,150), 'red')
		
		print("lines complete")
		
		filename = 'attention_'+ str(value) + '.png'
		surface.write_to_png(filename)
		print(filename)


def main():
	images(3)

if __name__ == '__main__':
	main()
