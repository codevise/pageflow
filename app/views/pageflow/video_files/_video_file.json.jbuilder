json.call(video_file, :width, :height)
json.variants video_file.present_outputs + [:poster_large, :poster_ultra]
