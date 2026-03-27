<script lang="ts">
  import { apiFetch } from '$lib/api'
  import { onMount } from 'svelte'
  import { DatePicker, parseDate, Portal } from '@skeletonlabs/skeleton-svelte';
  import auth from '$lib/auth.svelte'

  let weightValue = $state('')
  let comment = $state('')
  let notedAt = $state([parseDate(new Date())])
  let loading = $state(false)
  let metricId = $state('')
  let error = $state('')

  onMount(async () => {
    if (!auth.authenticated) {
      return
    }
    console.log(performance.now(), 'Fetching metrics...')
    try {
      const metrics = await apiFetch('/api/metrics')
      const weightMetric = metrics.find((metric) => metric.name === 'weight')
      if (weightMetric) {
        metricId = weightMetric.id
      } else {
        console.error('Weight metric not found')
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    }
  })

  async function handleSubmit() {
    // Handle comma as decimal separator for European users
    if (weightValue.includes(',') && !weightValue.includes('.')) {
      weightValue = weightValue.replace(',', '.')
    }
    const floatWeight = parseFloat(weightValue)
    if (isNaN(floatWeight)) {
      error = 'Please enter a number for weight'
      return
    } else if (floatWeight <= 0 || floatWeight > 500) {
      error = 'Please enter a weight value between 0 and 500 kg'
      return
    }

    if (!metricId) {
      error = 'Weight metric not found. Please try again later.'
      return
    }

    loading = true

    const requestBody = {
      metricId,
      value: floatWeight,
      comment,
      notedAt: new Date(notedAt).toISOString()
    }

    try {
      await apiFetch('/api/entries', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })
    } catch (err) {
      console.error('Failed to submit weight entry:', err)
      error = 'Failed to submit weight entry. Please try again.'
    } finally {
      loading = false
      weightValue = ''
      comment = ''
      notedAt = [parseDate(new Date())]
      error = ''
    }
  }
</script>

<div class="container mx-auto max-w-md mt-20 p-8">
  <h1 class="text-2xl font-bold mb-8">Log weight</h1>

  <div class="flex flex-col gap-4">
    <input
      class="input"
      type="text"
      placeholder="Weight (kg)"
      bind:value={weightValue}
    />
    <input
      class="input"
      type="text"
      placeholder="Comment"
      bind:value={comment}
    />
    <DatePicker locale = "en-UK" {notedAt} onValueChange={(e) => (notedAt = e.value)}>
      <DatePicker.Control>
        <DatePicker.Input placeholder="dd/mm/yyyy" />
        <DatePicker.Trigger />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Context>
                {#snippet children(datePicker)}
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger />
                    <DatePicker.ViewTrigger>
                      <DatePicker.RangeText />
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger />
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableHead>
                      <DatePicker.TableRow>
                        {#each datePicker().weekDays as weekDay, id (id)}
                          <DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
                        {/each}
                      </DatePicker.TableRow>
                    </DatePicker.TableHead>
                    <DatePicker.TableBody>
                      {#each datePicker().weeks as week, id (id)}
                        <DatePicker.TableRow>
                          {#each week as day, id (id)}
                            <DatePicker.TableCell value={day}>
                              <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          {/each}
                        </DatePicker.TableRow>
                      {/each}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                {/snippet}
              </DatePicker.Context>
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Context>
                {#snippet children(datePicker)}
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger />
                    <DatePicker.ViewTrigger>
                      <DatePicker.RangeText />
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger />
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
                        <DatePicker.TableRow>
                          {#each months as month, id (id)}
                            <DatePicker.TableCell value={month.value}>
                              <DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          {/each}
                        </DatePicker.TableRow>
                      {/each}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                {/snippet}
              </DatePicker.Context>
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Context>
                {#snippet children(datePicker)}
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger />
                    <DatePicker.ViewTrigger>
                      <DatePicker.RangeText />
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger />
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
                        <DatePicker.TableRow>
                          {#each years as year, id (id)}
                            <DatePicker.TableCell value={year.value}>
                              <DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          {/each}
                        </DatePicker.TableRow>
                      {/each}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                {/snippet}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker>

    {#if error}
      <p class="text-error-500">{error}</p>
    {/if}

    <button
      class="btn preset-filled"
      onclick={handleSubmit}
      disabled={loading}
    >
      {loading ? 'Logging weight...' : 'Log weight'}
    </button>
  </div>
</div>
